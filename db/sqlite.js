const config = require('../config');

var sqlite3 = require('sqlite3').verbose();

var dbLoc = config.db.sqlite.memory ? ':memory:' : config.db.sqlite.file;

var db = new sqlite3.Database(dbLoc, function() {
	db.run("CREATE TABLE IF NOT EXISTS rep (id VARCHAR(20) UNIQUE, up INT, down INT)", function(err, row) {
		if(err) { throw err; }
	});
});

var insert = function(id, isUpvote) {
	return new Promise(function(resolve, reject) {
		var increment = db.prepare("INSERT INTO rep (id, up, down) VALUES (?, ?, ?)");
		increment.run(id, isUpvote ? 1 : 0, isUpvote ? 0 : 1, function(err) {
			if(err) { reject(err); }
			resolve();
		});
	});
}

module.exports = {
	fetch: function(id) {
		return new Promise(function(resolve, reject) {
			var fetch = db.prepare("SELECT * FROM rep WHERE id = ? LIMIT 1");
			fetch.get(id, function(err, row) {
				if(err) { reject(err); }
				if(row) {
					resolve({
						up: row.up,
						down: row.down
					});
				} else {
					resolve({
						up: 0,
						down: 0
					});
				}
			});
		});
	},
	up: function(id, amt) {
		return new Promise(function(resolve, reject) {
			var fetch = db.prepare("SELECT * FROM rep WHERE id = ? LIMIT 1");
			fetch.get(id, function(err, row) {
				if(err) { reject(err); }
				if(row) {
					var increment = db.prepare("UPDATE rep SET up = up + ? WHERE id = ?");
					increment.run(amt, id, function(err) {
						if(err) { reject(err); }
						resolve(false);
					});
				} else {
					insert(id, true)
						.then(function() {
							resolve(true);
						})
						.catch(function() {
							reject(err);
						});
				}
			});
		});
	},
	down: function(id, amt) {
		return new Promise(function(resolve, reject) {
			var fetch = db.prepare("SELECT * FROM rep WHERE id = ? LIMIT 1");
			fetch.get(id, function(err, row) {
				if(err) { reject(err); }
				if(row) {
					var increment = db.prepare("UPDATE rep SET down = down + ? WHERE id = ?");
					increment.run(amt, id, function(err) {
						if(err) { reject(err); }
						resolve(false);
					});
				} else {
					insert(id, false)
						.then(function() {
							resolve(true);
						})
						.catch(function() {
							reject(err);
						});
				}
			});
		});
	}
}