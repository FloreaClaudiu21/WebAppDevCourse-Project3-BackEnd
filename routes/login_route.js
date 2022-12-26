const express = require("express");
const User = require("../public/js/user");
const Validate = require("../public/js/validate");
const { LocalStorage } = require("node-localstorage");
const router = express.Router();
const localStorage = new LocalStorage("./scratch");
const page_title = "Brief history of famous rock bands | Login into your account";
// [POST]
router.post("/login", async (req, res) => {
	const { email, password } = req.body;
	const VALIDATOR = new Validate();
	const USER = new User(VALIDATOR);
	/////////////////////////////////
	const logged = await USER.login(email.toLowerCase(), password);
	if (logged) {
		localStorage.setItem(
			"user",
			`email: ${email.toLowerCase()}|password: ${password}`
		);
		res.redirect("/");
		return;
	}
	res.render("login", {
		title: page_title,
		message: VALIDATOR.msgh,
	});
	return;
});
// [GET]
router.get("/login", async (req, res) => {
	const VALIDATOR = new Validate();
	const USER = new User(VALIDATOR);
	/////////////////////////////////
	let is_logged = await USER.is_logged();
	if (is_logged.a) {
		res.redirect("/");
		return;
	}
	res.render("login", { title: page_title, message: VALIDATOR.msgh });
});
module.exports = { login_route: router };
