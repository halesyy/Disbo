
module.exports = {
	socketConnection: function(a) {
    // console.log("[XX:XX:XX] Socket initiated")
		a.io.on("connection", function(socket) {
      // console.log("Connection gathered! Socket Connection inside io conn")
			a.event.emit("begin client connection", socket);
			socket.on("disconnect", function() {
				for (var b in a.users) {
					if (typeof c !== 'undefined' && a.users[b].socketId === c.id) {
						null != a.users[b].currentRoom && (a.console.writeLine.info("(" + a.users[b].ip + ') User "' + a.users[b].username + '" left ' + a.users[b].currentRoom), delete a.rooms[a.users[b].currentRoom].users[b], c.removeAllListeners("verify movement"), c.removeAllListeners("user leave"), a.io.sockets["in"](a.users[b].currentRoom).emit("remove user", b));
						a.console.writeLine.info('User "' + a.users[b].username + '" disconnected');
						delete a.users[b];
						for (var d in a.loops[b]) {
							clearInterval(a.loops[b][d]);
						}
						delete a.loops[b];
					}
				}
				a.io.sockets.emit("client count update", {
					response: Object.keys(a.users).length
				});
			});
		});
	},

  // Game connection, connecting the client into the game-world
	gameConnection: function(a, c) {
    // console.log(c);
      c.on("client connection", function(b) {
        c.clientVars = b;
        c.emit("change loading state", {
          response: 25
        });
        a.event.emit("begin sso check", c);
      });
	}
};
