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
                Briefs.push([results[0]]);
                resolve(true);
              }
            });
        });
      }
      return Briefs;
    }

}
