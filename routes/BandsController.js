const express = require("express");
const router = express.Router();
const Database = require("../public/js/sql");

// [GET] GET BAND LIST FROM DATABASE
router.get("/api/v1/bands", async (req, res) => {
	const DATABASE = new Database();
	const result = await DATABASE.fetch(`SELECT * FROM bands`);
	if (result == null || result.length <= 0) {
		res.status(404).json({ error: true, response: "No bands have been found" });
		return;
	}
	res.status(200).json({ error: false, response: result });
	return;
});

// [POST] ADD BAND IN THE DATABASE
router.post("/api/v1/bands", async (req, res) => {
	const { linkref, photo, link, title, text, embed } = req.body;
	if (!linkref || !photo || !link || !title || !text || !embed) {
		res.status(404).json({ error: true, response: "Invalid data" });
		return;
	}
	const DATABASE = new Database();
	const result = await DATABASE.fetch(
		`INSERT INTO bands(linkref, link, title, photo,text, embed) VALUES ('${linkref}','${link}','${title}','${photo}',"${text}",'${embed}')`
	);
	if (result == null || result.length <= 0) {
		res.status(404).json({ error: true, response: "No band have been added." });
		return;
	}
	res.status(200).json({ error: false, response: result });
	return;
});

module.exports = { main_route: router };
