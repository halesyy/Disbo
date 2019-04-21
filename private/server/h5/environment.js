
var http      = require("http"),
	  socketIo  = require("socket.io"),
	  pool      = require("./database/pool"),
	  events    = require("events"),
  	sanitizer = require("sanitizer"),
  	rl        = require("readline").createInterface(process.stdin, process.stdout);



module.exports = function(b, d) {
	var a = this;
	a.users = {};
	a.rooms = {};
	a.loops = [];
	a.configuration = b; //c
	a.fuserights = d;

	this.scope = function() {
		return a;
	};

	this.buildHttp = function() {
		a.server = http.createServer();
	};

	this.buildEventHandler = function() {
		a.event = new events.EventEmitter;
	};

	this.buildIo = function() {
		a.io = socketIo(this.server);
	};

	this.buildPool = function() {
		a.pool = pool(b);
	};

	this.listen = function() {
    // console.log(b)
		a.server.listen(b.server.ports.game, function(e) {
			a.console.updateTitle();
			setInterval(function() {
				a.console.updateTitle();
			}, 100);
			a.console.writeLine.bass("H5 Habbo Server - Created by Kedi Agbogre");
      // console.log(a)
      e ?
				a.console.writeLine.error("Unable to listen on port " + b.server.ports.game) :
				(a.console.writeLine.warning("Server now listening on port " + b.server.ports.game), a.acceptCommands());
		});
	};

	this.acceptCommands = function() {
		rl.on("line", function(e) {
			switch (e) {
				case "shutdown":
					a.console.shutdown();
					break;
				case "online count":
					a.console.onlineCount();
					break;
				default:
					a.console.writeLine.error("Command not recognized");
			}
		});
	};

	this.filter = function(a, b) {
		for (var c in b) {
			a = a.replace("%" + c + "%", b[c]);
		}
		return a;
	};

	this.sanitize = function(a) {
		return sanitizer.escape(a);
	};

	this.securify = function(a) {
		var b = ["password"];
		if (a.id) {
			for (var c in a) {
				-1 < b.indexOf(c) && delete a[c];
			}
		} else {
			for (var d in a) {
				for (c in a[d]) {
					-1 < b.indexOf(c) && delete a[c];
				}
			}
		}
		return a;
	};

	this.game = {
		user: {
			update: require("./game/user/update"),
			greet: require("./game/user/greet"),
			enter: require("./game/user/enter"),
			loops: {
				creditsAndDuckets: require("./game/user/loops").creditsAndDuckets
			}
		},
		rooms: {
			load: require("./game/rooms/load"),
			move: require("./game/rooms/move"),
			chat: require("./game/rooms/chat"),
			leave: require("./game/rooms/leave")
		},
		furni: {
			unify: require("./game/rooms/furniUnify")
		}
	};

	this.networking = {
		socketConnection: require("./networking/connection").socketConnection,
		gameConnection: require("./networking/connection").gameConnection,
		singleSignOn: require("./networking/sso"),
		redundancyCheck: require("./networking/redundancy"),
		login: require("./networking/login")
	};

	this.console = require("./utils/console")(a);
};
