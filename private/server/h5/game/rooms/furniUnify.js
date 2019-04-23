/*
 * Taking in furniture short-loads and spitting out room
 * changes to base
 */

module.exports = function(environment, shorthandFurni) {

    database = environment.pool;

    database.getConnection(function(d, db){

        /* --
         * iterating through the short-hand to gather
         * the database rows into a furnitureData collection
         * that can be later managed.
         */
        CompletionPromises = []
        for (var furnix in shorthandFurni) {
          furniData = shorthandFurni[furnix]
          furniSplit = furniData.split(":")

          /* --
           * checking against internal, configured rules whether the formatting
           * is correct. (has to contain one ":" to get past default check)
           */
          if (furniSplit.length == environment.configuration.database_rules.furni.shorthand_segments) {
            nameIdentifier = furniSplit[0];
            basexy = furniSplit[1];
            const furnitureData = [];

            // Getting all nameid information from shorthand [0] side
            CompletionPromises.push(new Promise((resolve, reject) => {
              globaldb.query("SELECT * FROM furniture WHERE nameId = :nameid", {
                replacements: { nameid: nameIdentifier },
                type: Sequelize.QueryTypes.SELECT
              }).then(function(result){
                row = result[0];
                furnitureData.push({
                  nameId: nameIdentifier,
                  description: row.description,
                  adjacentLocations: row.adjacentLocations,
                  rotateable: row.rotateable
                });
                resolve(furnitureData)
              })
            }))
          }

        } //# Finishing the for iterations, converting all shorthand -> longhand


        Promise.all(CompletionPromises).then((value) => {
          console.log(value)
        });

      // query = db.query("SELECT * FROM furniture WHERE identifier = ?", )
    });

}
