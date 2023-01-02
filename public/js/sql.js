const mysql = require("mysql");
const util = require("util");
const SQLPROPS = {
	host: process.env.MYSQLHOST,
	user: process.env.MYSQLUSER,
	password: process.env.MYSQLPASS,
};
class Database {
	SQLCON = mysql.createConnection(SQLPROPS);
	query = util.promisify(this.SQLCON.query).bind(this.SQLCON);
	async fetch(q) {
		let results = null;
		try {
			let result = await this.query(q);
			results = result;
		} catch (err) {
			console.log(err);
		}
		this.SQLCON.end();
		return results;
	}
	async init() {
		try {
			await this.query("USE webapp");
		} catch (err) {
			console.log(err);
		}
	}
}

module.exports = Database;
