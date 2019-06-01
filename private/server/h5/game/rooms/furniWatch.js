
module.exports = function(env, frontend, frontenddata) {


    /*
     *
     */
    frontend.on("verify remove furniture", async function(fe_eventinfo, reply){
        // console.log("Starting to verify the removal");
        // console.log(fe_eventinfo);

        // just check that inventoryID and roomID are ints
        // first round of auth - integers
        var bad_reply = {error: true, reason: false};
        var ei = fe_eventinfo;
        var replied = false;
        if (isNaN(ei.roomID) || isNaN(ei.inventoryID)) {
          bad_reply.reason = "Wrong data was sent.. Contact an Administrator."; reply(bad_reply);
          return;
        }

        // then check if inventoryID maps to the roomID and sso user ID
        var userID = await environment.game.dbops.users.ssoToDiscordId(ei.sso);
        var inventoryRows = await gt("SELECT * FROM users_inventory WHERE id = :irow", {irow: ei.inventoryID});
        if (inventoryRows.length != 1) { bad_reply.reason = "Bad rows.."; reply(bad_reply); return; }
        // check that the data is mapped to row appropriately
        var inventoryID = parseInt(ei.inventoryID);
        var roomID = ei.roomID;
        var inventoryRow = inventoryRows[0];
        // physical check
        var allowedToPlaceFurniInRoom = await environment.dbops.users.allowedToPlaceFurniInRoom(userID, roomID);
        console.log("data for room furni removal:");
        console.log("userid: ", userID);
        console.log(allowedToPlaceFurniInRoom, inventoryRow);
        if (inventoryRow.roomID !== roomID || inventoryRow.userID !== userID || !allowedToPlaceFurniInRoom) {
          bad_reply.reason = "This isn't your furniture."; reply(bad_reply);
          return;
        }

        // is good to update.
        console.log(`[XX:XX:XX] User ${userID} just removed furniture in room ${ei.roomID}`);
        up("UPDATE users_inventory SET root = '', roomID = '0' WHERE id = :irow", {irow: ei.inventoryID});
        reply({
          error: false
        });
        environment.io.to(frontenddata.roomId).emit("remove furni from id", ei.inventoryID);
        return;
    });


    /*
     * setting up the allmighty "verify furniture place"
     * socket to come back and return the callback with
     * a threshold of great data.
     */
    console.log("establishing furni place socket connection");
    frontend.on("verify furniture place", async function(fe_eventinfo, reply){
      console.log("Starting to verify the furniture placing");

      // first round of auth - integers
      var bad_reply = {error: true, reason: false};
      var ei = fe_eventinfo;
      var replied = false;
      if (isNaN(ei.amount) || isNaN(ei.root[0]) || isNaN(ei.root[1]) || isNaN(ei.roomID)) {
        bad_reply.reason = "Wrong data was sent.. Contact an Administrator."; reply(bad_reply);
        return;
      }

      // checking if user has permission
      var userID = await environment.game.dbops.users.ssoToDiscordId(ei.sso);
      var roomID = ei.roomID;
      var permissionToPlace = await environment.game.dbops.users.allowedToPlaceFurniInRoom(userID, roomID);
      if (!permissionToPlace) {
        bad_reply.reason = "You're not allowed to place furni in this room!"; reply(bad_reply);
        return;
      }

      // 1. use merge of the room to get the tiles which CANNOT be placed on top of.
      // 2. once merge is good and shows us what tiles we cant place on (==1),
      //    get the furni that wants to be placed's furniture longhand and
      //    iterate the adjacents to see if any overlaps a walkable, if so return "bad
      //    place, there are things there!" or something - dont think we need to worry
      //    about obstructive users's.


      // third round if auth, making sure furnis position is possible and not obstructive.
      var shorthand = await environment.dbops.room.shorthand(roomID);
      var longhand = await environment.dbops.room.longhand(shorthand);
      // console.log(longhand);
      var base = await environment.dbops.room.base(roomID);
      var base = environment.game.rooms.converter.toNumeric(base); // securify
      var mergedFloorplan = environment.game.furni.floorplanMerge(environment, base, longhand, defNotWalkable=1);

      var furnitureRow = await gt("SELECT * FROM furniture WHERE nameId = :nid", {nid: ei.nameId});
      if (furnitureRow.length == 0) { bad_reply.reason = "Furniture lookup failed. Contact an administrator..."; reply(bad_reply); }
      var adjacents = furnitureRow[0].adjacents.split("\r").join("").split("\n");
      var wantsToPlace = ei.root;

      var placeable = true;
      for (adjacentx in adjacents) {
        var xyAdjacent = adjacents[adjacentx].split(',');
        var xmove = parseInt(xyAdjacent[0]);
        var ymove = parseInt(xyAdjacent[1]);
        var xroot = parseInt(wantsToPlace[0]);
        var yroot = parseInt(wantsToPlace[1]);
        // checking parameters
        var checkx = parseInt(xmove + xroot);
        var checky = parseInt(ymove + yroot);
        // console.log(checkx, checky);
        // console.log(base[checkx][checky])
        // checking that map area even exists:
        // console.log(base);
        // console.log(checky, checkx);
        // console.log(base.length-1);
        // console.log(base[checky].length-1);
        if (checky >= base.length || checkx >= base[checky].length) {}
        else if (base[checky][checkx] == 1) placeable = false;
      }

      if (!placeable) {
        bad_reply.reason = "One or more tiles are blocked..."; reply(bad_reply);
        return;
      }

      // fourth and last round of auth... getting the amount of furni that this user has
      // to do what they with so we can ret whether or not to close the menu and to place it.
      // if 0, obv just error tf out of it.
      var furniAvailable = await environment.dbops.users.furniAmountAvailable(userID, ei.nameId);
      if (furniAvailable == 0) {
        bad_reply.reason = "You don't have any of this furniture left.. :~("; reply(bad_reply);
        return;
      }

      // you can finally place the furni!
      if (!replied) {
        // console.log(roomID, ei.nameId, `${ei.root[0]},${ei.root[1]}`, userID);
        // updating the furnis location :~)
        // getting the inventoryid before inserting into the database.
        furniPlaced = await gt("SELECT * FROM users_inventory WHERE identifier = :fid AND roomID = '0' AND root = '' AND userID = :uid LIMIT 1", {
          fid: ei.nameId,
          uid: userID
        });
        await up("UPDATE users_inventory SET roomID = :rid, root = :root WHERE identifier = :fid AND roomID = '0' AND root = '' AND userID = :uid LIMIT 1", {
          rid: roomID,
          fid: ei.nameId,
          root: `${ei.root[1]},${ei.root[0]}`,
          uid: userID,
        });
        // console.log(furniPlaced);
        furniAvailable -= 1;
        // sending out the longhand furni object to all users in the room ID
        // to generate the furni for all clients.
        environment.io.to(frontenddata.roomId).emit("new furni placed", [{
          inventoryID: furniPlaced[0].id,
          nameId: ei.nameId,
          description: furnitureRow[0].description,
          location: furnitureRow[0].location,
          adjacents: furnitureRow[0].adjacents,
          rotateable: furnitureRow[0].rotateable,
          walkable: furnitureRow[0].walkable,
          stackable: furnitureRow[0].stackable,
          baselayer: furnitureRow[0].baselayer,
          bottomAdjust: furnitureRow[0].bottomAdjust,
          rootBlock: `${ei.root[1]},${ei.root[0]}`
        }]);

        reply("GOOD SO FAR FAM");
      }
    });



}
