module.exports = {

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

    insert: async function(query, replacements) {
      return new Promise((resolve, reject) => {
        globaldb.query(query, {
          replacements: replacements,
          type: Sequelize.QueryTypes.INSERT
        }).then(function(rows){
          resolve(rows);
        });
      });
    },

    update: async function(query, replacements) {
      return new Promise((resolve, reject) => {
        globaldb.query(query, {
          replacements: replacements,
          type: Sequelize.QueryTypes.UPDATE
        }).then(function(rows){
          resolve(rows);
        });
      });
    },

    delete: async function(query, replacements) {
      return new Promise((resolve, reject) => {
        globaldb.query(query, {
          replacements: replacements,
          type: Sequelize.QueryTypes.INSERT
        }).then(function(rows){
          resolve(rows);
        });
      });
    },

    hasData: async function(query, replacement) {
        var rows = await this.get(query, replacement);
        if (rows.length > 0) return true;
        else return false;
    }

}
