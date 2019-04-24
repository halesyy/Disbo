const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const database = require("./h5/database/pool");
const mysql = require('mysql');
// for cross-origina-request-s
const cors = require('cors');

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'disbo'
});
connection.connect();

app.use(bodyParser.json({ limit: '1mb' }));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false, limit: '1mb' }));

/*
 * returning the GET data for a profile that exists,
 * with reference to the session.
 */
app.get("/api/profile/:id", function(req, res){
  // console.log("API CALL TO WHAT WE WANT");
  // console.log(req, res);
  console.log("Called 1");
  let userid = req.params.id;
  globaldb.query("SELECT username,figure FROM users WHERE id = :userid", {
    replacements: { userid: userid },
    type: Sequelize.QueryTypes.SELECT
  }).then(function(result){
    // Profile exists, checking if client is their friend...
    console.log("Called 2");
    if (result.length > 0) res.json(result[0])
    else res.json({error: true});
  });
});

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
  });
});


// app.use('/api', router);
app.listen(7777)
