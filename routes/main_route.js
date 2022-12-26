const express = require("express");
const router = express.Router();
const User = require("../public/js/user");
const page_title = "Brief history of famous rock bands | Main Page";
const { LocalStorage } = require("node-localstorage");
const localStorage = new LocalStorage("./scratch");
const Validate = require("../public/js/validate");
// [GET]
router.get("/", async (req, res) => {
	const VALIDATOR = new Validate();
	let USER = new User(VALIDATOR);
	///////////////////////////////
	let is_logged = await USER.is_logged();
	if (!is_logged.a) {
		res.redirect("/login");
		return;
	}
	let user_data = await USER.data(is_logged.email);
	if (user_data == null || user_data.length <= 0) {
		localStorage.removeItem("user");
		res.redirect("/login");
		return;
	}
	res.render("main", {
		title: page_title,
		message: VALIDATOR.msgh,
		user: user_data[0],
	});
});
module.exports = { main_route: router };
