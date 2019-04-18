var mysql = require('mysql');

var pool = function(conf) {
	return mysql.createPool({
		host: conf.mysql.host,
		user: conf.mysql.user,
		password: conf.mysql.pass,
		database: conf.mysql.db
	});
};

module.exports = pool;
