const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const database = require("./h5/database/pool");
const mysql = require('mysql');

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'ilovejek123',
  database : 'disbo'
});
connection.connect();

app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '1mb' }));

app.post('/set/token', function (req, res) {
  let checkUserExists = `SELECT * FROM users WHERE discordid = ?`
  connection.query(checkUserExists, req.body.user.id, function(error, results, fields) {
    if (error) throw error;
    const result = JSON.parse(JSON.stringify(results));
    if (result.length < 1) {
      let newUser = `INSERT INTO users(username, discordid, sso, diamonds, credits, duckets, figure)
                     VALUES('${req.body.user.username}#${req.body.user.discriminator}', '${req.body.user.id}', 'abc', 1000, 152900, 760500, 'sh-3035-82.hd-180-1.ch-3001-82-1408.lg-3290-110.cc-886-110.hr-3278-45-40')`;
      connection.query(newUser, function (error, results, fields) {
        if (error) throw error;

      });
    }
    let setToken = `UPDATE users SET sso = '${req.body.user.token}' WHERE discordid = '${req.body.user.id}'`;
    connection.query(setToken, function (error, results, fields) {
      if (error) throw error;

    });

  })


});





app.listen(7777)
