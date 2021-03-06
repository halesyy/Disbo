/*
 * Taking in furniture short-loads and spitting out room
 * changes to base
 */

module.exports = function(environment, shorthandFurni) {

    database = environment.pool;
    returnableLonghand = false

    /* --
     * iterating through the short-hand to gather
     * the database rows into a furnitureData collection
     * that can be later managed.
     */
    CompletionPromises = []
    furnitureData = [];
    for (var furnix in shorthandFurni) {
      const furniData = shorthandFurni[furnix]
      // console.log(furniData);
      const furniSplit = furniData.split(":")

      /* --
       * checking against internal, configured rules whether the formatting
       * is correct. (has to contain one ":" to get past default check)
       */
      if (furniSplit.length == environment.configuration.database_rules.furni.shorthand_segments) {
        const inventoryID = furniSplit[0];
        const nameIdentifier = furniSplit[1];
        const basexy = furniSplit[2];
        const baselayer = furniSplit[3];


        // Getting all nameid information from shorthand [0] side
        CompletionPromises.push(new Promise((resolve, reject) => {
          globaldb.query("SELECT * FROM furniture WHERE nameId = :nameid", {
            replacements: { nameid: nameIdentifier },
            type: Sequelize.QueryTypes.SELECT
          }).then(function(result){
            var row = result[0];
            if (baselayer == -1) {
              var bl = row.baselayer;
            } else bl = baselayer;
            if (baselayer != 0) {
              console.log(row);
            }
            resolve({
              inventoryID: inventoryID,
              nameId: nameIdentifier,
              description: row.description,
              // adjacentLocations: row.adjacentLocations,
              location: row.location,
              adjacents: row.adjacents,
              rotateable: row.rotateable,
              walkable: row.walkable,
              stackable: row.stackable,
              bottomAdjust: row.bottomAdjust,
              baselayer: bl,
              rootBlock: basexy
            })
          })
        }))
      }

    } //# Finishing the for iterations, converting all shorthand -> longhand

    // Returning the promises.all
    return Promise.all(CompletionPromises)

}
