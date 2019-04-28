
module.exports = function(env, frontend, frontenddata) {


    /*
     * setting up the allmighty "verify furniture place"
     * socket to come back and return the callback with
     * a threshold of great data.
     */
    frontend.on("verify furniture place", async function(fe_eventinfo, reply){
      console.log("Starting to verify the furniture placing");

      // first round of auth - integers
      var bad_reply = {error: true, reason: false};
      var ei = fe_eventinfo;
      var replied = false;
      if (isNaN(ei.amount) || isNaN(ei.root[0]) || isNaN(ei.root[1]) || isNaN(ei.roomID)) {
        bad_reply.reason = "Wrong data was sent.. Contact an Administrator."; reply(bad_reply);
        replied = true;
      }

      // checking if user has permission
      var userID = await environment.game.dbops.users.ssoToUserId(ei.sso);
      var roomID = parseInt(ei.roomID);
      var permissionToPlace = await environment.game.dbops.users.allowedToPlaceFurniInRoom(userID, roomID);
      if (!permissionToPlace && !replied) {
        bad_reply.reason = "You're not allowed to place furni in this room!"; reply(bad_reply);
        replied = true;
      }

      // 1. use merge of the room to get the tiles which CANNOT be placed on top of.
      // 2. once merge is good and shows us what tiles we cant place on (==1),
      //    get the furni that wants to be placed's furniture longhand and
      //    iterate the adjacents to see if any overlaps a walkable, if so return "bad
      //    place, there are things there!" or something - dont think we need to worry
      //    about obstructive users's.


      // third round if auth, making sure furnis position is possible and not obstructive.
      var longhand = await environment.dbops.room.longhand(roomID);
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
        var checkx = xmove + xroot;
        var checky = ymove + yroot;
        // console.log(checkx, checky);
        // console.log(base[checkx][checky])
        if (base[checky][checkx] == 1) placeable = false;
      }

      if (!placeable) {
        bad_reply.reason = "One or more tiles are blocked..."; reply(bad_reply);
        replied = true;
      }

      // fourth and last round of auth... getting the amount of furni that this user has
      // to do what they with so we can ret whether or not to close the menu and to place it.
      // if 0, obv just error tf out of it.
      var furniAvailable = await environment.dbops.users.furniAmountAvailable(userID, ei.nameId);
      if (furniAvailable == 0) {
        bad_reply.reason = "You don't have any of this furniture left.. :~("; reply(bad_reply);
        replied = true;
      }

      // you can finally place the furni!
      if (!replied) {


        reply("GOOD SO FAR FAM");
      }
    });



}
