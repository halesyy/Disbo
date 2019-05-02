module.exports = {

      shorthand: async function(roomID) {
        var roomFurni = await environment.dbops.basic.get("SELECT * FROM users_inventory WHERE roomID = :rid AND root LIKE '%,%'", {rid: roomID});
        shorthand = [];
        for (furnirowidx in roomFurni) {
          var row = roomFurni[furnirowidx]
          shorthand.push(`${row.id}:${row.identifier}:${row.root}:${row.baselayer}`);
        }
        return shorthand;
      },

      base: async function(roomID) {
        if (isNaN(roomID)) return false;
        var roomData = await gt("SELECT * FROM rooms WHERE guildID = :id", {id: roomID});
        return roomData[0].base;
      },

      longhand: async function(shorthand) {
        if (!isNaN(shorthand)) var shorthand = await this.shorthand(shorthand);
        // adone
        // console.log(shorthand);
        longhand = [];
        for (shorthandidx in shorthand) {
          var shortDefiner = shorthand[shorthandidx];
          var pieces = shortDefiner.split(":");
          var inventoryID = pieces[0];
          var identifier = pieces[1];
          var root = pieces[2];
          // loading furnidata beyond the shorthand array.
          var furniture = await environment.dbops.basic.get("SELECT * FROM furniture WHERE nameId = :nid", {nid: identifier});
          var row = furniture[0];
          longhand.push({
            inventoryID: inventoryID,
            nameId: identifier,
            description: row.description,
            // adjacentLocations: row.adjacentLocations,
            location: row.location,
            adjacents: row.adjacents.split("\r").join(""),
            rotateable: row.rotateable,
            baselayer: row.baselayer,
            walkable: row.walkable,
            bottomAdjust: row.bottomAdjust,
            rootBlock: root
          });
        }
        // console.log(longhand);
        return longhand;
      },


}
