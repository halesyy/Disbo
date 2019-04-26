/*
 * Combines the base of the room with the
 * properties of the furniture, to remove
 * the walkability if so.
 */

module.exports = function(environment, base, longhandFurni) {

  // console.log("\nGoing to start merging the base and longhandfurni\n");
  // console.log(base);
  // console.log(longhandFurni);

  NOT_WALKABLE = 6
  WALKABLE = 0
  // console.log(base);
  for (schemex in longhandFurni) {
    schemeData = longhandFurni[schemex];
    if (schemeData.walkable == 0) {
      // Not walkable, making areas == 0 on base
      // First, removing the base
      x = parseInt(schemeData.rootBlock.split(',')[0]);
      y = parseInt(schemeData.rootBlock.split(',')[1]);

      // Now iterating over adjacentLocations, as that should contain
      // a 0:0 for base, splitting the adjacentLocations TEXT from Database
      locationDataRows = schemeData.adjacentLocations.split("\n");
      for (locationx in locationDataRows) {
        // The split data from each individual TEXT row at `adjacentLocations` in `furniture`
        locationRow = locationDataRows[locationx];
        locationData = locationRow.split(': ');

        xyMovement = locationData[0]
        filelocation = locationData[1]
        xmove = parseInt(xyMovement.split(',')[0]);
        ymove = parseInt(xyMovement.split(',')[1]);

        base[x+xmove][y+ymove] = NOT_WALKABLE;
      }

    }
  }
  // console.log(base);

  return base
}
