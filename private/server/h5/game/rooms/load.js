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

  c.users[a.currentUser.id].currentRoom = roomData.roomId;
  c.console.writeLine.info("(" + a.currentUser.ip + ') User "' + a.currentUser.username + '" joined ' + roomData.roomId);

  // Connecting to frontend-generating piece of code, pulling the matrix
  // from enter.js
  a.emit("render room", {
    base: roomData.roomData.base,
    longhandFurni: roomData.roomData.longhandFurni
  });
  a.join(roomData.roomId);

  c.rooms[roomData.roomId] || (c.rooms[roomData.roomId] = {}, c.rooms[roomData.roomId].users = {});
  c.rooms[roomData.roomId].users[a.currentUser.id] = a.currentUser;
  c.rooms[roomData.roomId].users[a.currentUser.id].currentPosition = "0:5";

  c.io.sockets["in"](roomData.roomId).emit("dialog", {
    title: a.currentUser.username + " has joined the room",
    body:"Everybody give him/her a welcoming hug! NO PUBLIC DISPLAYS OF AFFECTION"
  });

  a.emit("load all users", c.securify(c.rooms[roomData.roomId].users));
  a.broadcast.to(roomData.roomId).emit("user join", a.currentUser);

};
