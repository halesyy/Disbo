// For updating the user's information, when called it will simply gather
// all user data and emit a socket response to update anything related to that.

module.exports = function(api, socket, database) {
  d = database
  b = api
  a = socket

	database.query("SELECT * FROM users WHERE id = ?", a.currentUser.id, function(f, c) {
		if (api.users[socket.currentUser.id]) {
			for (var e in c[0])
				api.users[a.currentUser.id][e] = c[0][e];

      socket.emit("update userinfo", api.securify(c[0]));

    }
		database.release();
	});
};
