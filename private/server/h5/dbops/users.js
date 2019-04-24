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
    }

}
