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
var pf = require("pathfinding");
module.exports = function(env, frontend, frontenddata) {
  const b = env;
  const c = frontend;
  const d = frontenddata;

  // frontend.off("user chat", function(){
  //   console.log("This was successfully turnt off");
  // });

	frontend.on("user chat", function(message) {
    const a = message
		if (message != null) {
			var isCommand = false;
			var ha = message.match("\:ha (.*)");
			if (ha) {
				b.io.sockets.emit('dialog', {
					title: 'Message by Habbo Staff',
					body: ha[1]
				});
				isCommand = true;
			};
			var about = message.match("\:about");
			if (about) {
				c.emit('dialog', {
					title: 'Discord Game',
					body: 'Created by Jack Hales & Oliy Barrett'
				});
				isCommand = true;
			};
      // if the message is not a command, reply with the emitting
      if (!isCommand) {
        message = environment.sanitize(a);
        var all_in_room = environment.io.to(frontenddata.roomId).adapter.rooms[frontenddata.roomId];
        console.log(all_in_room);
        console.log(`[XX:XX:XX] ${frontend.currentUser.username} just said: "${message}" in room ${frontenddata.roomId}`);
        environment.io.to(frontenddata.roomId).emit("user chat bubble",
          message,
          frontend.currentUser.username,
					frontend.currentUser.discordid,
          environment.rooms[frontenddata.roomId].users[frontend.currentUser.id].currentPosition,
					frontend.currentUser.avatar
        );
      }
		}
	});
	frontend.on("user typing", function() {
		b.io.sockets["in"](d.roomId).emit('user typing bubble', c.currentUser.id);
	});
	frontend.on("user stopped typing", function() {
		b.io.sockets["in"](d.roomId).emit('user stopped typing', c.currentUser.id);
	});
};
