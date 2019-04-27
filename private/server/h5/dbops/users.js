module.exports = {

    ssoToUserId: async function(sso) {
      return new Promise((resolve, reject) => {
        globaldb.query("SELECT id FROM users WHERE sso = :sso", {
          replacements: { sso: sso },
          type: Sequelize.QueryTypes.SELECT
        }).then(function(result){
          if (result.length > 0) resolve(result[0].id);
        });
      });
    },

    friendsIds: async function(userid) {
      return new Promise((resolve, reject) => {
        globaldb.query("SELECT * FROM friends WHERE (userID1 = :userid OR userID2 = :userid) AND pending = 0", {
          replacements: { userid: userid },
          type: Sequelize.QueryTypes.SELECT
        }).then(function(friends){
          resolve(friends);
        });
      });
    },

    // if all = false, then it's just getting the furni
    // that has no root and room id, since that furni has been
    // placed
    inventory: async function(userid, all=true) {
      if (all) {
        var inven = await environment.game.dbops.basic.get("SELECT * FROM users_inventory WHERE userID = :id", {id: userid});
      }
      else {
        var inven = await environment.game.dbops.basic.get("SELECT * FROM users_inventory WHERE root = '' AND roomID < 1 AND userID = :id", {id: userid});
      }
      // console.log(inven);
      return inven;
    },

    /*
     * taking all of the rows and creating a better way
     * to represent them to the user.
     */
    countInventory: async function(furnis) {
      countedInventory = {}
      for (furnirowx in furnis) {
        // userID, roomID, identifier, root, rotation
        if (furnis[furnirowx].identifier in countedInventory) {
          // console.log("")
          countedInventory[furnis[furnirowx].identifier].amount += 1
        }
        else {
          let longhand = await environment.game.dbops.basic.get("SELECT * FROM furniture WHERE nameId = :nid", {nid: furnis[furnirowx].identifier});
          countedInventory[furnis[furnirowx].identifier] = {
            amount: 1,
            iconloc: longhand[0].location
          }
        }
      }
      return countedInventory;
      // console.log(countedInventory);
    },

    inventoryFromSso: async function(sso, all=true) {
      let userid = await this.ssoToUserId(sso);
      return await this.inventory(userid, all);
    },

    pendingIds: async function(userid) {
      return new Promise((resolve, reject) => {
        globaldb.query("SELECT * FROM friends WHERE (userID2 = :userid) AND pending = 1", {
          replacements: { userid: userid },
          type: Sequelize.QueryTypes.SELECT
        }).then(function(pending){
          resolve(pending);
        });
      });
    },

    get: async function(query, replacements) {
      return new Promise((resolve, reject) => {
        globaldb.query(query, {
          replacements: replacements,
          type: Sequelize.QueryTypes.SELECT
        }).then(function(rows){
          resolve(rows);
        });
      });
    },

    pendingBriefs: async function(pendingIds, clientid) {
      for (pendingIdx in pendingIds) {
        //e.g.:id: 1, userID1: 2, userID2: 1, pending: 0
        let friendRow = pendingIds[pendingIdx];
        if (friendRow.userID1 == clientid) pendingIds[pendingIdx].friendId = friendRow.userID2
        else pendingIds[pendingIdx].friendId = friendRow.userID1
      }


      const friendsRowsEdit = pendingIds;
      const Briefs = [];

      for (idx in friendsRowsEdit) {
        //e.g.:id: 1, userID1: 2, userID2: 1, pending: 0
        let friendRow = friendsRowsEdit[idx];
        // console.log(friendRow);
        let userData = await this.get("SELECT avatar,discordid,id,username,nickname FROM users WHERE (id = :id1)", {
          id1: friendRow.friendId
        });
        console.log("user data");
        console.log(userData);
        userData[0].discordavatarurl = `https://images.discordapp.net/avatars/${userData[0]["discordid"]}/${userData[0]["avatar"]}.png?size=256`;
        Briefs.push(userData[0]);
      }
      return Briefs;
    },

    // returning an array of JUST ids that are other users
    justFriendsIds: async function(friendsRows, personalid) {
      var friendsids = [];
      for (idx in friendsRows) {
        var friendRow = friendsRows[idx];
        if (friendRow.userID1 != personalid) friendsids.push(friendRow.userID1);
        if (friendRow.userID2 != personalid) friendsids.push(friendRow.userID2);
      }
      return friendsids;
    },

    friendsIdsToBrief: async function(friendsRows, personalid) {
      Promises = [];
      const friendsRowsEdit = friendsRows;
      const Briefs = [];

      for (idx in friendsRowsEdit) {
        //e.g.:id: 1, userID1: 2, userID2: 1, pending: 0
        const friendRow = friendsRowsEdit[idx];
        await new Promise((resolve, reject) => {
            globaldb.query("SELECT avatar,discordid,id,username,nickname FROM users WHERE (id = :id1 OR id = :id2) AND (id != :personalid)", {
              replacements: { id1: friendRow.userID1, id2: friendRow.userID2, personalid: personalid },
              type: Sequelize.QueryTypes.SELECT
            }).then(function(results){
              if (results.length == 1) {
                results[0].discordavatarurl = `https://images.discordapp.net/avatars/${results[0]["discordid"]}/${results[0]["avatar"]}.png?size=256`;
                Briefs.push(results[0]);
                resolve(true);
              }
            });
        });
      }
      return Briefs;
    }

}
