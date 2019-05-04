/**
 * Habbo HTML5
 *
 * Based upon original code by:
 *
 * Copyright (c) 2014 Kedi Agbogre (me@kediagbogre.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

// THIS IS A PRIVATE FILE

module.exports = function(c, a, roomData) {
  frontend = a;

  c.users[a.currentUser.id].currentRoom = roomData.roomId;
  c.console.writeLine.info("(" + a.currentUser.ip + ') User "' + a.currentUser.username + '" joined ' + roomData.roomId);

  // Connecting to frontend-generating piece of code, pulling the matrix
  // from enter.js
  // console.log(roomData);
  a.emit("render room", {
    name: roomData.name,
    base: roomData.roomData.base,
    longhandFurni: roomData.roomData.longhand
  });
  // console.log(a.rooms);
  let currentRoomsIn = a.rooms;
  for (var roomname in currentRoomsIn) {
    a.leave(currentRoomsIn[roomname]);
    // console.log("left "+currentRoomsIn[roomname]);
  }

  a.join(roomData.roomId);

  // load.js is the file for injecting all interesting user-based data
  const avatars = [["https://mobilegamegraphics.com/pvpaterno/flying_pack/flying_1.gif", 80, false],
['https://thumbs.gfycat.com/HastyGrippingDuck-max-1mb.gif', 80, false],
// ['https://i.kym-cdn.com/photos/images/original/000/784/180/ecf.gif', 80, false],
// ['https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/7fc1430f-5c8f-41dc-a2ba-341cec31bbab/d4l9sr3-64553510-5101-4aeb-b3ed-fa2e940998d8.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzdmYzE0MzBmLTVjOGYtNDFkYy1hMmJhLTM0MWNlYzMxYmJhYlwvZDRsOXNyMy02NDU1MzUxMC01MTAxLTRhZWItYjNlZC1mYTJlOTQwOTk4ZDguZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.u6qDYoNpzXyXOIdF91aSM3ZEG4Bj5ajw4IR10RAfbWQ'
// , 80, true],
// ['https://thumbs.gfycat.com/BasicAmbitiousCivet-max-1mb.gif', 80, false],
// ['http://retribution.fm/r/146/images/image03.gif', 80, false],
// ['https://cdnb.artstation.com/p/assets/images/images/003/303/407/original/nisa-bernal-character-walking-animation.gif?1472203528', 80, false],
['http://static.tumblr.com/53b6e3825c73f54cd04bac0c33d7f60d/xslkzvt/o8Rmqi2pl/tumblr_static_tumblr_static_tumblr_static_tumblr_static_chibi_transparent_cas.gif', 80, false],
// ['https://i.pinimg.com/originals/5d/5e/d2/5d5ed2917f0a764ce2123f35cc353240.gif', 80, false],
// ['https://i.pinimg.com/originals/9c/7a/6b/9c7a6bd0fe96252493065e8afb837e4a.gif', 80, false],
// ['https://i.pinimg.com/originals/22/99/a6/2299a66bab649e9369abbd704967fd88.gif', 80, true]
];


  c.rooms[roomData.roomId] || (c.rooms[roomData.roomId] = {}, c.rooms[roomData.roomId].users = {});
  c.rooms[roomData.roomId].users[a.currentUser.id] = a.currentUser;
  c.rooms[roomData.roomId].users[a.currentUser.id].currentPosition = "0:5";
  c.rooms[roomData.roomId].users[a.currentUser.id].sprite = avatars[~~(Math.random()*avatars.length)];

  // c.io.sockets["in"](roomData.roomId).emit("dialog", {
  //   title: a.currentUser.username + " has joined the room",
  //   body:"Everybody give him/her a welcoming hug! NO PUBLIC DISPLAYS OF AFFECTION"
  // });

  a.emit("load all users", c.securify(c.rooms[roomData.roomId].users));
  a.broadcast.to(roomData.roomId).emit("user join", a.currentUser);

};
