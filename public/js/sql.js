const util = require("util");
const mysql = require("mysql");
const reverse = require('reverse-md5');
const dec = revese({
    lettersUpper: false,
    lettersLower: true,
    numbers: true,
    special: false,
    whitespace: true,
    maxLen: 12
})
const SQLPROPS = {
	host: dec(process.env.MYSQLHOST),
	user: dec(process.env.MYSQLUSER),
	password: dec(process.env.MYSQLPASS),
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
