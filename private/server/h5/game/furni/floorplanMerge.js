/*
 * Combines the base of the room with the
 * properties of the furniture, to remove
 * the walkability if so.
 */

module.exports = function(environment, base, longhandFurni, defNotWalkable = false) {

  // console.log("\nGoing to start merging the base and longhandfurni\n");
  // console.log(base);
  // console.log(longhandFurni);

  if (defNotWalkable === false)
    NOT_WALKABLE = 6
  else NOT_WALKABLE = defNotWalkable;
  WALKABLE = 0
  // STACKABLE = 7
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
      locationDataRows = schemeData.adjacents.split("\n");
      for (locationx in locationDataRows) {
        // The split data from each individual TEXT row at `adjacentLocations` in `furniture`
        locationRow = locationDataRows[locationx];
        // locationData = locationRow.split(': ');

        xyMovement = locationRow;
        // filelocation = locationData[1];
        xmove = parseInt(xyMovement.split(',')[0]);
        ymove = parseInt(xyMovement.split(',')[1]);

        if (x+xmove >= base.length || y+ymove >= base[x+xmove].length) {}
        else base[x+xmove][y+ymove] = NOT_WALKABLE;
      }

    }
  }
  // console.log(base);
  return base
}
