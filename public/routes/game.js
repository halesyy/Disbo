const { Router } = require('express');
const router = new Router();
const fetch = require('node-fetch');

const db = require('../utils/db');
const config = require('../config');
const main = require('../app');

router.get('/', (req, res) => {
  if (!req.user) return res.redirect('/login');
  const opts = {
    host: config.gameServer.host,
    port: config.gameServer.port,
    type: config.gameServer.type,
    apihost: config.api.host,
    apiport: config.api.port,
    dev: config.dev,
  }
  res.render('client', { user: req.user, opts });
});


module.exports = router;
