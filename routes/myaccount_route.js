const express = require("express");
const User = require("../public/js/user");
const router = express.Router();
const page_title = "Brief history of famous rock bands | Account Page";
const { LocalStorage } = require("node-localstorage");
const localStorage = new LocalStorage("./scratch");
const Validate = require("../public/js/validate");
// [GET]
router.post("/myaccount", async (req, res) => {
	const VALIDATOR = new Validate();
	let USER = new User(VALIDATOR);
	///////////////////////////////
	const files = req.files;
	const query = req.query;
	let sampleFile = null;
	if (files != null) {
		sampleFile = files.profile;
	}
	const { pass, secret } = req.body;
	let email = USER.extract_mail();
	if (email == null) {
		localStorage.removeItem("user");
		res.redirect("/login");
		return;
	}
	if (query.deleteimg == "true") {
		await USER.delete_profile(email);
		return;
	}
	await USER.change_info(email, pass, sampleFile, secret);
	let user_data = await USER.data(email);
	if (user_data == null || user_data.length <= 0) {
		localStorage.removeItem("user");
		res.redirect("/login");
		return;
	}
	res.render("myaccount", {
		title: page_title,
		message: VALIDATOR.msgh,
		user: user_data[0],
	});
});
// [GET]
router.get("/myaccount", async (req, res) => {
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
	res.render("myaccount", {
		title: page_title,
		message: VALIDATOR.msgh,
		user: user_data[0],
	});
});
module.exports = { myaccount_route: router };
