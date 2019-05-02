const { Router } = require('express');
const router = new Router();
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const db = require('../utils/db');
const config = require('../config');
const main = require('../app');

router.get('/login', (req, res) => {
  let state;
  if (req.query.redir) state = Buffer.from(req.query.redir).toString('base64');
  res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${config.client_id}&scope=${config.scopes.join('%20')}${state ? `&state=${state}` : ''}&redirect_uri=${encodeURIComponent(config.redirect_uri)}&response_type=code`);
});


router.get('/login/callback', async (req, res, next) => {
  try {
    if (req.query.error === 'access_denied') return res.redirect('/');
    if (req.query.error) return res.sendError(400, "There was an error authorizing you on Discord's side");
    const code = req.query.code;
    let state = req.query.state;
    if (state) state = Buffer.from(state, 'base64').toString('utf8');

    const tokenRes = await fetch('https://discordapp.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(config.redirect_uri)}&client_id=${config.client_id}&client_secret=${config.client_secret}`,
    });

    if (tokenRes.ok) {
      const tokenBody = await tokenRes.json();
      const accessToken = tokenBody.access_token;
      const refreshToken = tokenBody.refresh_token;

      const userRes = await fetch('https://discordapp.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (userRes.ok) {
        const userBody = await userRes.json();

        db.User.findOne({ id: userBody.id }, async (err, user) => {
          if (err) return next(err);
          if (!user) user = new db.User();

          const token = jwt.sign({
              id: userBody.id,
              username: userBody.username,
              discriminator: userBody.discriminator,
              avatar: userBody.avatar,
          }, 'memes');
          console.log(token);

          user.access_token = accessToken; // eslint-disable-line camelcase
          user.refresh_token = refreshToken; // eslint-disable-line camelcase
          user.id = userBody.id;
          user.username = userBody.username;
          user.discriminator = userBody.discriminator;
          user.avatar = userBody.avatar;
          user.token = token;

          user.save(err => {
            if (err) return next(err);
            req.session.did = user.id;
            res.redirect(state ? state : '/');
          });

          const body = {
            user: {
              id: userBody.id,
              username: userBody.username,
              discriminator: userBody.discriminator,
              avatar: userBody.avatar,
              token: token,
            }
          }

          console.log("Setting the token.");
          const devadd = config.dev? '': '/api';
          const setTokenGameServer = await fetch(`${config.gameServer.type}://${config.api.host}:${config.api.port}${devadd}/api/set/token`, {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
              Authorization: `teste`,
              'Content-Type': 'application/json'
            },
          });
          console.log("Set the token game server");

          if (setTokenGameServer.ok) console.log("OK RESPONSE FROM THE SET TOKEN");
        });
      } else {
        return res.sendError(500, 'An unknown error occurred while getting your data. Please try again.');
      }
    } else {
      const message = tokenRes.status === 401 ?
        'The code returned by Discord is either expired or invalid. Please try again.' :
        'An unknown error occurred while authorizing you. Is Discord having issues again?';
      return res.sendError(400, message);
    }
  } catch (e) {
    console.error(e);
    return res.sendError(500, 'Unexpected error');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid', { secure: config.url.indexOf('dev') === -1 });
    res.redirect('/');
  });
});

module.exports = router;
