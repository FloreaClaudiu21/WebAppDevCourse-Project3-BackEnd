const router = require("express").Router();
const User = require("../public/js/user");
const Validate = require("../public/js/validate");
const page_title = "Brief history of famous rock bands | Create a new account";
// [POST]
router.post("/register", async (req, res) => {
	const { user, email, pass, repass, secret_code } = req.body;
	const VALIDATOR = new Validate();
	const USER = new User(VALIDATOR);
	/////////////////////////////////
	let registered = await USER.register(
		user.toLowerCase(),
		email.toLowerCase(),
		pass,
		repass,
		secret_code,
	);
	// IF USER WAS REGISTERED REDIRECT HIM TO THE LOGIN PAGE
	if (registered) {
		res.redirect("/login");
		return;
	}
	res.render("register", {
		title: page_title,
		message: VALIDATOR.msgh,
	});
	return;
});
// [GET]
router.get("/register", (req, res) => {
	const validator = new Validate();
	res.render("register", { title: page_title, message: validator.msgh });
});
module.exports = { register_route: router };
