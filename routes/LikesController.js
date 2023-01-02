const e = require("express");
const express = require("express");
const router = express.Router();
const Database = require("../public/js/sql");

// [POST] GET LIKES LIST FROM DATABASE FOR BAND
router.post("/api/v1/likes", async (req, res) => {
	const { bandid } = req.body;
	if (!bandid) {
		res.status(404).json({ error: true, response: "Invalid data" });
		return;
	}
	const DATABASE = new Database();
	const result = await DATABASE.fetch(
		`SELECT * FROM likes WHERE bandid="${bandid}"`
	);
	if (result == null || result.length <= 0) {
		res.status(404).json({
			error: true,
			response: "No likes have been found for this band",
		});
		return;
	}
	res.status(200).json({ error: false, response: result });
	return;
});

// [POST] ADD/REMOVE/GET LIKE FOR USER FROM THE DATABASE
router.post("/api/v1/like", async (req, res) => {
	const { mode, uid, bandid } = req.body;
	if (!mode || !uid) {
		res.status(404).json({ error: true, response: "Invalid data" });
		return;
	}
	let statement = "";
	const database = new Database();
	if (mode === "delete") {
		statement = `DELETE FROM likes WHERE uid='${uid}' AND bandid='${bandid}'`;
	} else if (mode === "create") {
		statement = `INSERT INTO likes(uid, bandid) VALUES ('${uid}', '${bandid}')`;
	} else {
		statement = `SELECT * FROM likes WHERE uid="${uid}"`;
	}
	const result = await database.fetch(statement);
	if (result == null || result.length <= 0) {
		res
			.status(404)
			.json({ error: true, response: "Nothing have been changed" });
		return;
	}
	res.status(200).json({ error: false, response: result });
	return;
});

module.exports = { main_route: router };
