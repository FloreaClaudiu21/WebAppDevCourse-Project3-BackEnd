module.exports = class Validate {
	msgh = {
		field: "",
		text: "",
	};
	code = (text, field) => {
		if (text === "" || text === undefined || text.length <= 0) {
			this.msgh.field = field;
			this.msgh.text =
				"X Error: You must type something in the field '" + field + "'.";
			return false;
		}
		if (text.length < 6) {
			this.msgh.field = field;
			this.msgh.text = this.msgh.text =
				"X Error: " + field + " length must be atleast 6 characters.";
			return false;
		}
		return true;
	};
	text = (text, field) => {
		if (text === "" || text === undefined || text.length <= 0) {
			this.msgh.field = field;
			this.msgh.text =
				"X Error: You must type something in the field '" + field + "'.";
			return false;
		}
		if (text.length < 4) {
			this.msgh.field = field;
			this.msgh.text = this.msgh.text =
				"X Error: " + field + " length must be atleast 4 characters.";
			return false;
		}
		return true;
	};
	samepass = (password, repass) => {
		if (!this.password(password) || !this.password(repass)) {
			return false;
		}
		if (!password.match(repass)) {
			this.msgh.field = "repass";
			this.msgh.text = "X Error: You must type the same password!";
			return false;
		}
		return true;
	};
	password = (password) => {
		if (!this.text(password)) {
			this.msgh.field = "password";
			this.msgh.text = "X Error: You must type the password!";
			return false;
		}
		if (password.length < 5) {
			this.msgh.field = "password";
			this.msgh.text = "X Error: Password length must be atleast 5 characters.";
			return false;
		}
		if (password.length > 20) {
			this.msgh.field = "password";
			this.msgh.text =
				"X Error: Password length must not exceed 20 characters.";
			return false;
		}
		return true;
	};
	email = (email) => {
		const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
		if (!this.text(email)) {
			this.msgh.field = "email";
			this.msgh.text = "X Error: You must type the email address!";
			return false;
		}
		if (reg.test(email) === false) {
			this.msgh.field = "email";
			this.msgh.text = "X Error: Invalid email address!";
			return false;
		}
		return true;
	};
};
