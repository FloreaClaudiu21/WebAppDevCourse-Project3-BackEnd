const express = require("express");
const router = express.Router();
const Database = require("../public/js/sql");

// [GET] GET FEEDBACK LIST FROM DATABASE
router.get("/api/v1/feedbacks", async (req, res) => {
	const DATABASE = new Database();
	const result = await DATABASE.fetch(`SELECT * FROM feedbacks`);
	if (result == null || result.length <= 0) {
		res
			.status(404)
			.json({ error: true, response: "No feedbacks have been found" });
		return;
	}
	res.status(200).json({ error: false, response: result });
	return;
});

// [POST] ADD FEEDBACK IN THE DATABASE
router.post("/api/v1/feedbacks", async (req, res) => {
	const { mode, uuid, uid, time, message } = req.body;
	if (!mode || !uuid || !uid || !time || !message) {
		res.status(404).json({ error: true, response: "Invalid data" });
		return;
	}
	let statement = "";
	const database = new Database();
	if (mode === "delete") {
		statement = `DELETE FROM feedbacks WHERE uuid='${uuid}'`;
	} else {
		statement = `INSERT INTO feedbacks(uuid, uid, time, message) VALUES ('${uuid}','${uid}','${time}','${message}')`;
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
