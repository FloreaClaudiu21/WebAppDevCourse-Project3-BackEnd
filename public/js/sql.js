const util = require("util");
const mysql = require("mysql");
const SQLPROPS = {
	host: process.env.MYSQLHOST,
	user: process.env.MYSQLUSER,
	password: process.env.MYSQLPASS,
	database: "webapp",
};
class Database {
	SQLCON = mysql.createConnection(SQLPROPS);
	query = util.promisify(this.SQLCON.query).bind(this.SQLCON);
	async fetch(q) {
		let results = null;
		this.SQLCON.connect();
		try {
			let result = await this.query(q);
			results = result;
		} catch (err) {
			console.log(err);
		}
		this.SQLCON.end();
		return results;
	}
}

module.exports = Database;
