const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const database = require("./h5/database/pool");
const conf = require("./h5/conf.json")
const mysql = require('mysql');
// for cross-origina-request-s
const cors = require('cors');

const connection = mysql.createConnection({
  host     : conf.mysql.host,
  user     : conf.mysql.user,
  password : conf.mysql.pass,
  database : conf.mysql.db
});
connection.connect();

app.use(bodyParser.json({ limit: '1mb' }));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false, limit: '1mb' }));


/* ================================================================
 * SHOP
 * ================================================================
 */

     app.get("/api/shop/categories", async function(req, res){
       let categories = await gt("SELECT DISTINCT(category) FROM furniture");
       // console.log(categories);
       let catreturn  = [];
       for (var row of categories)
          catreturn.push(row.category);
       res.json(catreturn);

       // var userid = req.params.id;
       // globaldb.query("SELECT id,username,motto,figure,avatar,discordid FROM users WHERE id = :userid", {
       //   replacements: { userid: userid },
       //   type: Sequelize.QueryTypes.SELECT
       // }).then(function(result){
       //   // Profile exists, checking if client is their friend...
       //   if (result.length > 0) {
       //     // result[0].userid =
       //     result[0].discordavatarurl = `https://images.discordapp.net/avatars/${result[0]["discordid"]}/${result[0]["avatar"]}.png?size=256`;
       //     res.json(result[0]);
       //   }
       //   else res.json({error: true});
       // });
     });



     app.get("/api/currency/:sso", async function(req, res){
       let userID   = await ssouid(req.params.sso);
       let currency = await users.currency(userID);
       res.json(currency);
     });


     app.get("/api/shop/furni/:bycategory", async function(req, res){
       let category = req.params.bycategory;
       let furnis = await gt("SELECT * FROM furniture WHERE category = :cat", {cat: category});
       // console.log("find by category furni: "+furnis);
       const furnistore = [];
       for (furni of furnis) {
         furnistore.push({
           nameId: furni.nameId,
           category: furni.category,
           description: furni.description,
           location: furni.location,
           creditCost: furni.creditCost
         });
       }
       res.json(furnistore);
     });


     app.post("/api/shop/buy", async function(req, res){
       const badReply = {error: true, short: "UNSPECIFIED", reason:"unspecified"};

       let sso = req.body.sso;
       let nameId = req.body.furni;
       let userID   = await environment.dbops.users.ssoToUserId(sso);
       let discordId= await environment.dbops.users.ssoToDiscordId(sso);
       let currency = await environment.dbops.users.currency(userID);
       let clientCredits = currency.credits;

       // getting furni information
       let furniStore = await gt("SELECT * FROM furniture WHERE nameId = :nid", {nid: nameId});
       let creditCost = furniStore[0].creditCost;

       // user aint got no money send em to the purchaseables ;)
       if ( (clientCredits - creditCost) < 0) {
         badReply.short = "POOR";
         badReply.reason = "Not enough credits to purchaes this item.";
         res.json(badReply);
         return;
       }

       var newClientCredits = (clientCredits - creditCost);

       // 1. add new furni to the row
       is("INSERT INTO users_inventory (userID, roomID, identifier, root, rotation, baselayer) VALUES (:userID, '0', :fid, '', '0', '0')", {
         userID: discordId,
         fid: nameId
       });
       // 2. change users currency
       up("UPDATE users SET credits = :newcredits WHERE id = :id", {
         newcredits: newClientCredits,
         id: userID
       });
       res.json({error: false});
       // let category = req.params.bycategory;
       // let furnis = await gt("SELECT * FROM furniture WHERE category = :cat", {cat: category});
       // console.log("find by category furni: "+furnis);
       // const furnistore = [];
       // for (furni of furnis) {
       //   furnistore.push({
       //     category: furni.category,
       //     description: furni.description,
       //     location: furni.location,
       //     creditCost: furni.creditCost
       //   });
       // }
       // res.json(furnistore);
     });







/*
 * returning the GET data for a profile that exists,
 * with reference to the session.
 */
app.get("/api/profile/:id", function(req, res){
  var userid = req.params.id;
  globaldb.query("SELECT id,username,motto,figure,avatar,discordid FROM users WHERE id = :userid", {
    replacements: { userid: userid },
    type: Sequelize.QueryTypes.SELECT
  }).then(function(result){
    // Profile exists, checking if client is their friend...
    if (result.length > 0) {
      // result[0].userid =
      result[0].discordavatarurl = `https://images.discordapp.net/avatars/${result[0]["discordid"]}/${result[0]["avatar"]}.png?size=256`;
      res.json(result[0]);
    }
    else res.json({error: true});
  });
});

/*
 * returning all friend-based information
 * this is to be refreshed when the user clicks
 * to open the f/l, as well as their pending list.
 * just to be safe and make sure everything is current
 * as hell.
 */
app.get("/api/friends/:sso", async function(req, res){
  var sso           = req.params.sso;
  var userid        = await environment.game.dbops.users.ssoToUserId(sso);
  var friendsRows   = await environment.game.dbops.users.friendsIds(userid);
  var friendIds     = await environment.game.dbops.users.justFriendsIds(friendsRows, userid);
  var friendBriefs  = await environment.game.dbops.users.friendsIdsToBrief(friendsRows, userid);
  var pendingIds    = await environment.game.dbops.users.pendingIds(userid);
  var pendingbriefs = await environment.game.dbops.users.pendingBriefs(pendingIds, userid);
  res.json({
    clientID: userid,
    friendIds: friendIds,
    friendBriefs: friendBriefs,
    pending: pendingIds,
    pendingBriefs: pendingbriefs
  });
});



/*
 * returning rooms
 */
app.post("/api/rooms", async function(req, res){
  const badReply = {error: true, short: "UNSPECIFIED", reason:"unspecified"};
  //# data required:
  //# Public (bool)
  //# Room name
  //# Discord owner ID's
  //# Guild ID that it represents, as their "HQ"
  var by = req.body.by;

  // Going to sort by the "most recent" to return data
  if (by == 'recent') {
    var rooms = await gt("SELECT id,guildID,name FROM rooms WHERE public = '1' ORDER BY id DESC LIMIT 10");
  }
  else {
    var rooms = await gt("SELECT id,guildID,name FROM rooms WHERE public = '1' AND name LIKE :search ORDER BY id DESC LIMIT 10", {search:`%${by}%`});
  }
  res.json(rooms);
});










/*
 * discord bot-based function that takes in a grouping
 * of data and does operations for the bot.
 * --
 * ROOM-GENERATION
 */
app.post("/api/rooms/:guildID/create", async function(req, res){
  const badReply = {error: true, short: "UNSPECIFIED", reason:"unspecified"};
  //# data required:
  //# Public (bool)
  //# Room name
  //# Discord owner ID's
  //# Guild ID that it represents, as their "HQ"
  const requiredPostKeys = ["ownerIDs", "roomName", "public"];
  for (const required of requiredPostKeys)
    if (!req.body.hasOwnProperty(required))
      {
        badReply.short  = "IMPROPER_KEYS"; badReply.reason = "Improper required data was sent."; res.json(badReply);
      }

   const guildID  = req.params.guildID;
   const ownerIDs = req.body.ownerIDs; //array
   const roomName = req.body.roomName; //str
   const public   = req.body.public; //bool

   // checking if row exists already under guildID pretense
   const existingRows = await gt("SELECT * FROM rooms WHERE guildID = :gid", {gid: guildID});
   if (existingRows.length == 1) {
     badReply.short = "ALREADY_A_ROOM";
     badReply.reason = "Your room has already been setup.";
     badReply.guildID = guildID;
     res.json(badReply);
     return;
   }

   const DEFAULT_ROOM = 5; // the default copy template for a room
   const baseRow = await gt("SELECT base FROM rooms WHERE id = :id", {id: DEFAULT_ROOM});
   const base = baseRow[0].base;

   if (ownerIDs.length < 1) return;
   const ownerIDsString = ownerIDs.join(',');
   const ownerID = ownerIDs[0];
   const qret = await is("INSERT INTO rooms (ownerID, guildID, ownerIDs, name, base, public) VALUES (:ownerID, :guildID, :ownerIDs, :name, :base, :public)", {
     ownerID: ownerID,
     guildID: guildID,
     ownerIDs: ownerIDsString,
     name: roomName,
     base: base,
     public: public
   });
   res.json({error: false, guildID: guildID});

   // console.log(qret);
});

/*
 * changing
 */
app.patch("/api/rooms/:guildID/name", async function(req, res){
  const badReply = {error: true, short: "UNSPECIFIED", reason:"unspecified"};
  //# data required:
  //# Room name
  //# Guild ID that it represents, as their "HQ"
  const requiredPostKeys = ["roomName"];
  for (const required of requiredPostKeys)
    if (!req.body.hasOwnProperty(required))
      {
        badReply.short  = "IMPROPER_KEYS"; badReply.reason = "Improper required data was sent."; res.json(badReply);
      }

   const guildID = req.parms.guildID;
   const roomName = req.body.roomName;
});

app.patch("/api/rooms/:guildID/public", async function(req, res){
  const badReply = {error: true, short: "UNSPECIFIED", reason:"unspecified"};
  //# data required:
  //# Public (bool)
  //# Guild ID that it represents, as their "HQ"
  const requiredPostKeys = ["public"];
  for (const required of requiredPostKeys)
    if (!req.body.hasOwnProperty(required))
      {
        badReply.short  = "IMPROPER_KEYS"; badReply.reason = "Improper required data was sent."; res.json(badReply);
      }

   const guildID = req.params.guildID;
   const public = req.body.public;

});



/*
 * returning all friend-based information
 * this is to be refreshed when the user clicks
 * to open the f/l, as well as their pending list.
 * just to be safe and make sure everything is current
 * as hell.
 */
app.get("/api/inventory/:sso", async function(req, res){
  var sso            = req.params.sso;
  // var userid         = await environment.game.dbops.users.ssoToUserId(sso);
  var discordID      = await environment.game.dbops.users.ssoToDiscordId(sso);
  var inventory      = await environment.game.dbops.users.inventory(discordID, all=false);
  var countInventory = await environment.game.dbops.users.countInventory(inventory);
  // console.log(inventory, countInventory);
  console.log(`[XX:XX:XX] Refreshed ${discordID}'s inventory.`);
  res.json({
    inventory: countInventory
  });
});

app.post("/api/addFriend", async function(req, res){
  // checking friendid is a number
    let sso      = req.body.sso;
    let friendID = req.body.friendID;
    if (isNaN(friendID)) res.json({error:true,message:"friend id not int"});

    // getting other friend data ready to manipulate
    let userid   = await environment.dbops.users.ssoToUserId(sso);
    let query = "SELECT id FROM friends WHERE (userID1 = :clientid AND userID2 = :friendid) OR (userID2 = :clientid AND userID1 = :friendid)";
    let replacements = {
      clientid: userid,
      friendid: friendID
    }
    if (await environment.dbops.basic.hasData(query, replacements)) {
      // has data - let the user know so they dont nek
      res.json({
        hasdata: true
      });
    }
    else {
      // no data - inserting into database.
      // var res = await enironment.dbops.friends.sendFR(userid, friendID);
      let insertQuery = "INSERT INTO friends (userID1, userID2, pending) VALUES (:clientid, :friendid, '1')";
      let insertReplacements = {
        clientid: userid,
        friendid: friendID
      };
      let ins = await environment.dbops.basic.insert(insertQuery, insertReplacements);
      // console.log(ins);
      res.json({success: true});
    }
});




app.post("/api/removeFriend", async function(req, res){
  // checking friendid is a number
    let sso      = req.body.sso;
    let friendID = req.body.friendID;
    if (isNaN(friendID)) res.json({error:true,message:"friend id not int"});

    // getting other friend data ready to manipulate
    let userid   = await environment.dbops.users.ssoToUserId(sso);
    let query = "SELECT id FROM friends WHERE (userID1 = :clientid AND userID2 = :friendid) OR (userID2 = :clientid AND userID1 = :friendid)";
    let replacements = {
      clientid: userid,
      friendid: friendID
    }
    if (await environment.dbops.basic.hasData(query, replacements)) {
      // has data - deleting it rip.
      let deleteQuery = "DELETE FROM friends WHERE (userID1 = :clientid AND userID2 = :friendid) OR (userID2 = :clientid AND userID1 = :friendid)";
      let deleteReplacements = {
        clientid: userid,
        friendid: friendID
      };
      let ins = await environment.dbops.basic.delete(deleteQuery, deleteReplacements);
      // console.log(ins);
      res.json({success: true});
    }
    else {
      // opposite of adding friend, row doesnt exist therefore
      // we don't do anything.
      res.json({
        hasdata: false
      });
    }
});


app.post("/api/acceptPending", async function(req, res){
  // checking friendid is a number
    let sso      = req.body.sso;
    let friendID = req.body.friendID;
    if (isNaN(friendID)) res.json({error:true,message:"friend id not int"});

    // getting other friend data ready to manipulate
    let userid   = await environment.dbops.users.ssoToUserId(sso);
    let query = "SELECT id FROM friends WHERE (userID1 = :friendid AND userID2 = :clientid)";
    let replacements = {
      clientid: userid,
      friendid: friendID
    }
    if (await environment.dbops.basic.hasData(query, replacements)) {
      // has data - updating it.
      let updateQuery = "UPDATE friends SET pending = '0' WHERE (userID1 = :friendid AND userID2 = :clientid)";
      let updateReplacements = {
        clientid: userid,
        friendid: friendID
      };
      let ins = await environment.dbops.basic.update(updateQuery, updateReplacements);
      // console.log(ins);
      res.json({success: true});
    }
    else {
      // opposite of adding friend, row doesnt exist therefore
      // we don't do anything.
      res.json({
        hasdata: false
      });
    }
});

app.post('/api/set/token', function (req, res) {
  let checkUserExists = `SELECT * FROM users WHERE discordid = ?`
  connection.query(checkUserExists, req.body.user.id, function(error, results, fields) {
    if (error) throw error;
    const result = JSON.parse(JSON.stringify(results));
    if (result.length < 1) {
      // console.log(`${req.body.user.avatar}`);
      let newUser = `INSERT INTO users(username, discordid, avatar, sso, diamonds, credits, duckets, figure)
                     VALUES('${req.body.user.username}#${req.body.user.discriminator}', '${req.body.user.id}', '${req.body.user.avatar}', 'abc', 1000, 1000, 1000, 'sh-3035-82.hd-180-1.ch-3001-82-1408.lg-3290-110.cc-886-110.hr-3278-45-40')`;
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
app.listen(7777);
