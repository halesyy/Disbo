module.exports = {

      loadFromId: async function(roomid) {
      if (isNaN(roomid)) return false;
          // console.log("going to load "+roomid);
          const roomData = await environment.dbops.basic.get("SELECT * FROM rooms WHERE id = :id", {id: roomid});
          return roomData[0];
      },

      shorthandFurni: async function(roomid) {
      if (isNaN(roomid)) return false;
          // console.log("going to get furni");
          // roomid-based furni, that contains a root :)
          const userFurniDataRows = await environment.dbops.basic.get("SELECT * FROM users_inventory WHERE roomID = :roomid AND root LIKE '%,%'", {roomid: roomid});
          // gotta combine the "identifier:root"
          // console.log(userFurniDataRows);
          const shorthand = [];
          for (rowidx in userFurniDataRows) {
            furniRow = userFurniDataRows[rowidx];
            shorthand.push(`${furniRow.identifier}:${furniRow.root}`);
          }
          return shorthand;
      }


}
