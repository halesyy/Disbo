// Backend application
// require API

var env = require("./h5/environment"),
	conf  = require("./h5/conf.json"),
	fuse  = require("./h5/fuserights.json"),
	h5    = new env(conf, fuse);

var env   = require("./h5/environment"),
	  conf  = require("./h5/conf.json"),
	  fuse  = require("./h5/fuserights.json"),
	  h5    = new env(conf, fuse);

const environment = h5

// Setting up a constant database connection
const Sequelize = require('sequelize');
const globaldb = new Sequelize(conf.mysql.db, conf.mysql.user, conf.mysql.pass, {
  host: conf.mysql.host,
  dialect: 'mysql',
	logging: false
});

// Setting globals
global.globaldb  = globaldb
global.Sequelize = Sequelize
global.environment = environment
// all shorthand queries for querying the database! :)
global.gt = environment.dbops.basic.get;
global.is = environment.dbops.basic.insert;
global.up = environment.dbops.basic.update;
global.dt = environment.dbops.basic.delete;
global.users = environment.dbops.basic.users;
global.ssouid = environment.dbops.users.ssoToUserId;
global.ssodid = environment.dbops.users.ssoToDiscordId;
global.config = conf;

// temporary management of the ../fexport/data.json furni data
var import_from_fexport = false;
if (import_from_fexport) {
	const fdata = require("../fexport/data.json");
	const defaultPrice = 1;
	var count = 0;
	for (var furniData of fdata) {
		// if (count == 5) break;
		const category = furniData.category;
		const nameId = furniData.nameId;
		const location = furniData.location;
		var ins = is("INSERT INTO furniture (nameId, category, description, location, adjacents, creditCost, rotateable, walkable, baselayer, bottomAdjust) VALUES (:nameId, :category, '', :location, '0,0', :defaultPrice, '0', '1', '0', '0')", {
			defaultPrice: defaultPrice,
			nameId: nameId,
			category: category,
			location: location
		});
		console.log(ins);
		count += 1;
	}
}

// Loading the public->private API
require('./api');

// Setting up all environment variables
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
		// h5.game.user.loops.creditsAndDuckets(h5.scope(), a);
	},
	clientViewRendered: function(frontend) {
		/*
		 * once the socket tells us that the client has finished rendering,
		 * it is time to greet the user and run the enter process script to get
		 * them in the room, and able to start moving in the next step.
		 */
	  // console.log("client view rendered...");
		h5.game.user.greet(h5.scope(), frontend);
		h5.game.user.enter(h5.scope(), frontend);
		h5.game.user.loadProfile.handler(frontend);
		// h5.game.user.friends(frontend);
	},
	loadRoom: function(frontend, frontenddata) {
		/*
		 * starting the room loading process
		 */
	  // console.log("load room start...");
		// console.log("Just got data to load room, here it is!...: ")
		// console.log(frontenddata);
		// h5.game.rooms.join(h5.scope(), frontend, frontenddata);
		// console.log(environment.rooms);
		h5.game.rooms.load(h5.scope(), frontend, frontenddata);
		h5.game.rooms.chat(h5.scope(), frontend, frontenddata);
		h5.game.rooms.leave(h5.scope(), frontend, frontenddata);
		h5.game.rooms.move(h5.scope(), frontend, frontenddata);
		h5.game.rooms.furniWatch(h5.scope(), frontend, frontenddata);
		// console.log(environment.rooms);
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
