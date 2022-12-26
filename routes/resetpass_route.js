const User = require("../public/js/user");
const router = require("express").Router();
const page_title = "Brief history of famous rock bands | Reset password";
const { LocalStorage } = require("node-localstorage");
const localStorage = new LocalStorage("./scratch");
const Validate = require("../public/js/validate");

// [POST]
router.post("/resetpass", async (req, res) => {
	let reset = false;
	const { email, pass, repass, secret_code } = req.body;
	const VALIDATOR = new Validate();
	const USER = new User(VALIDATOR);
	/////////////////////////////////
	if (pass != undefined) {
		let changed = await USER.change_password(email.toLowerCase(), pass, repass);
		if (changed) {
			res.redirect("/login");
			return;
		}
	} else {
		reset = await USER.can_reset(email.toLowerCase(), secret_code);
		if (reset) {
			VALIDATOR.msgh.text =
				"Success: The secret code was correct, you can reset your password now! :)";
		}
	}
	res.render("resetpass", {
		title: page_title,
		message: VALIDATOR.msgh,
		reset: reset,
		email: email.toLowerCase(),
	});
	return;
});
// [GET]
router.get("/resetpass", async (req, res) => {
	const VALIDATOR = new Validate();
	res.render("resetpass", {
		title: page_title,
		message: VALIDATOR.msgh,
		reset: false,
		email: "",
	});
});
module.exports = { resetpass_route: router };
