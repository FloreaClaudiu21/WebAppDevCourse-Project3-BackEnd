const express = require("express");
const User = require("../public/js/user");
const Validate = require("../public/js/validate");
const { LocalStorage } = require("node-localstorage");
const router = express.Router();
const localStorage = new LocalStorage("./scratch");
const page_title = "Brief history of famous rock bands | Admin dashboard";
// [POST]
// [GET]
router.get("/dashboard", async (req, res) => {
	const VALIDATOR = new Validate();
	const USER = new User(VALIDATOR);
	/////////////////////////////////
	let is_logged = await USER.is_logged();
	if (!is_logged.a) {
		res.redirect("/login");
		return;
	}
	let isAdmin = await USER.is_admin(is_logged.email);
	if (!isAdmin) {
		res.redirect("/");
		return;
	}
	let user_data = await USER.data(is_logged.email);
	let users = await USER.users();
	for(let i = 0; i < 1001; i++) {
		users.push({
			id: i,
			email: "",
			user: "t" + i,
			role: "Admin",
			username: "tato" + i,
			password: "aaaaaaaaaa",
			secretcode: "1234"
		})
	}
	res.render("dashboard", {
		title: page_title,
		message: VALIDATOR.msgh,
		user: user_data[0],
		users: users,
	});
});
module.exports = { dashboard_route: router };
