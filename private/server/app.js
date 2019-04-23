// Backend application

// require API
require('./api');

var env = require("./h5/environment"),
	conf  = require("./h5/conf.json"),
	fuse  = require("./h5/fuserights.json"),
	h5    = new env(conf, fuse);

h5.buildHttp();
h5.buildIo();
h5.buildPool();
h5.buildEventHandler();

h5.networking.socketConnection(h5);

var callbacks = {
	clientConnection: function(a) {
    // console.log("Client connection")
		h5.networking.gameConnection(h5, a);
	},
	ssoCheck: function(a) {
    // console.log("Sso check")
		h5.networking.singleSignOn(h5, a);
	},
	establishConnection: function(a) {
    // console.log("Establish connection")
		h5.networking.redundancyCheck(h5.scope(), a);
	},
	userLogin: function(a) {
    // console.log("User login")
		h5.networking.login(h5.scope(), a);
		h5.game.user.loops.creditsAndDuckets(h5.scope(), a);
	},
	clientViewRendered: function(a) {
    // console.log("Client view rendered")
		h5.game.user.greet(h5.scope(), a);
		h5.game.user.enter(h5.scope(), a);
	},
	loadRoom: function(a, b) {
    // console.log("Load room")
		h5.game.rooms.load(h5.scope(), a, b);
		h5.game.rooms.chat(h5.scope(), a, b);
		h5.game.rooms.leave(h5.scope(), a, b);
		h5.game.rooms.move(h5.scope(), a, b);
	}
};

/*Event listener establishments.*/
h5.event.on("begin client connection", callbacks.clientConnection);
h5.event.on("begin sso check",         callbacks.ssoCheck);
h5.event.on("establish connection",    callbacks.establishConnection);
h5.event.on("user login",              callbacks.userLogin);
h5.event.on("client view rendered",    callbacks.clientViewRendered);
h5.event.on("load room",               callbacks.loadRoom);

h5.listen();
