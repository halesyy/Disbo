
module.exports = function(b, a, c) {
  a.on("join room id", function(roomid) {
    console.log("join room id" + roomid);
    // b.console.writeLine.info('User "' + a.currentUser.username + '" joined ' + c.roomId);

    // b.rooms[roomid].append(users[a.currentUser.id]);

    // console.log(b.rooms);
    // console.log(b.rooms);
    // a.removeAllListeners("verify movement");
    // a.removeAllListeners("user leave");
    // a.removeAllListeners("user chat");
    // b.users[a.currentUser.id].currentRoom = null;
    // console.log(b.rooms);
    // b.io.sockets["in"](c.roomId).emit("remove user", a.currentUser.id);
    // console.log(b.rooms);
  });
  // a.on("user leave room id", function(roomid){
  //   // console.log("room id user leave");
  //   b.console.writeLine.info('User "' + a.currentUser.username + '" left ' + roomid);
  //   // console.log(b.rooms);
  //   delete b.rooms[roomid].users[a.currentUser.id];
  //   // console.log(b.rooms);
  //   a.removeAllListeners("verify movement");
  //   a.removeAllListeners("user leave");
  //   a.removeAllListeners("user chat");
  //   b.users[a.currentUser.id].currentRoom = null;
  //   // console.log(b.rooms);
  //   b.io.sockets["in"](roomid).emit("remove user", a.currentUser.id);
  //   // console.log(b.rooms);
  // })
};
