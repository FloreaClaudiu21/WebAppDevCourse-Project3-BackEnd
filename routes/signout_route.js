const express = require("express");
const User = require("../public/js/user");
const Validate = require("../public/js/validate");
const { LocalStorage } = require("node-localstorage");
const router = express.Router();
const localStorage = new LocalStorage("./scratch");
// [GET]
router.get("/signout", async (req, res) => {
	res.redirect("/");
	return;
});
// [POST]
router.post("/signout", async (req, res) => {
	const VALIDATOR = new Validate();
	const USER = new User(VALIDATOR);
	/////////////////////////////////
	let is_logged = await USER.is_logged();
	if (is_logged.a) {
		localStorage.removeItem("user");
		res.redirect("/");
		return;
	} else {
		res.redirect("/login");
		return;
	}
});
module.exports = { signout_route: router };
