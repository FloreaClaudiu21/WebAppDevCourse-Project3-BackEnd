const express = require("express");
const router = express.Router();
const Database = require("../public/js/sql");

// [GET] CHECK UID IS ADMIN
router.post("/api/v1/admin", async (req, res) => {
	const DATABASE = new Database();
	const { uid } = req.body;
	if (!uid) {
		res.status(404).json({ error: true, response: "Invalid data" });
		return;
	}
	const result = await DATABASE.fetch(
		`SELECT * FROM admins WHERE uid='${uid}'`
	);
	if (result == null || result.length <= 0) {
		res.status(404).json({
			error: true,
			response: "No admin have been found with this id.",
		});
		return;
	}
	res.status(200).json({ error: false, response: result });
	return;
});

// [GET] GET ADMINS LIST FROM DATABASE
router.get("/api/v1/admins", async (req, res) => {
	const DATABASE = new Database();
	const result = await DATABASE.fetch(`SELECT * FROM admins`);
	if (result == null || result.length <= 0) {
		res
			.status(404)
			.json({ error: true, response: "No admins have been found" });
		return;
	}
	res.status(200).json({ error: false, response: result });
	return;
});

// [POST] ADD/REMOVE ADMIN FROM THE DATABASE
router.post("/api/v1/admins", async (req, res) => {
	const { mode, uid } = req.body;
	if (!mode || !uid) {
		res.status(404).json({ error: true, response: "Invalid data" });
		return;
	}
	let statement = "";
	const database = new Database();
	if (mode === "delete") {
		statement = `DELETE FROM admins WHERE uid='${uid}'`;
	} else {
		statement = `INSERT INTO admins(uid) VALUES ('${uid}')`;
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
