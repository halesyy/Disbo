/*
 * Taking in furniture short-loads and spitting out room
 * changes to base
 */

module.exports = function(environment, shorthandFurni) {

    database = environment.pool;

    database.getConnection(function(d, db){
      // console.log("We're in the furni unify, haha!");

        /*
         * iterating through the short-hand to gather
         * the database rows into a furnitureData collection
         * that can be later managed.
         */
        furniInformationPromises = []
        for (var furnix in shorthandFurni) {
          furniData = shorthandFurni[furnix]
          furniSplit = furniData.split(":")

          /*
           * checking against internal, configured rules
           */
          if (furniSplit.length == environment.configuration.database_rules.furni.shorthand_segments) {
            nameIdentifier = furniSplit[0];
            basexy = furniSplit[1];
            furnitureData = [];

            /*
             * database call to get the nameIdenfitier row information.
             */
            furnitureCaller = db.query("SELECT * FROM furniture WHERE nameId = ?", nameIdentifier, function(error, result, fields){
              if (error) throw error; // getting the furniture information, shorthand -> descriptive
              if (result.length == 0) return false;
              // results, to use the first and append to previous array
              row = result[0];
              furnitureData.push({
                nameId: nameIdentifier,
                description: row["description"],
                adjacentLocations: row["adjacentLocations"],
                rotateable: row["rotateble"]
              });
            });
            console.log(furnitureData);
          }
        } // end for loop


      // query = db.query("SELECT * FROM furniture WHERE identifier = ?", )
    });

}
