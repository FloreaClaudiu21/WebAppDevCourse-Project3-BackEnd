const Database = require("./sql");
const fs = require("fs");
const { LocalStorage } = require("node-localstorage");
const localStorage = new LocalStorage("./scratch");

class Role {
	static default = "User";
	static admin = "Admin";
}

module.exports = class User {
	constructor(valid) {
		this.valid = valid;
		this.DATABASE = new Database();
	}
	data = async (email) => {
		const result = await this.DATABASE.fetch(
			`SELECT * FROM users WHERE email='${email}'`
		);
		if (result == null || result.length <= 0) {
			return null;
		}
		return result;
	};
	exists = async (path, name) => {
		const result = await this.DATABASE.fetch(
			`SELECT * FROM users WHERE ${path}='${name}'`
		);
		if (result == null || result.length <= 0) {
			return false;
		}
		return true;
	};
	is_logged = async () => {
		let saved_user = localStorage.getItem("user");
		if (saved_user == null) {
			return { a: false };
		}
		if (!saved_user.includes("|") || !saved_user.includes(":")) {
			localStorage.removeItem("user");
			return { a: false };
		}
		let split = saved_user.split("|");
		let email = split[0].split(": ")[1];
		let password = split[1].split(": ")[1];
		let logged = await this.login(email, password);
		if (!logged) {
			localStorage.removeItem("user");
			return { a: false };
		}
		return { a: true, email: email, password: password };
	};
	extract_mail = () => {
		let saved_user = localStorage.getItem("user");
		if (saved_user == null) {
			return null;
		}
		if (!saved_user.includes("|") || !saved_user.includes(":")) {
			localStorage.removeItem("user");
			return null;
		}
		let split = saved_user.split("|");
		let email = split[0].split(": ")[1] + "";
		return email;
	};
	can_reset = async (email, secret_code) => {
		if (!this.valid.email(email)) {
			return false;
		}
		if (!this.valid.code(secret_code, "Secret Code")) {
			return false;
		}
		let email_exists = await this.exists("email", email);
		let code_true = await this.verify_code(email, secret_code);
		if (!email_exists) {
			this.valid.msgh.text =
				"X Error: User with this email address does not exist!";
			return false;
		}
		if (!code_true) {
			this.valid.msgh.text =
				"X Error: The secret code you entered it's incorrect!";
			return false;
		}
		return true;
	};
	verify_code = async (email, code) => {
		const result = await this.DATABASE.fetch(
			`SELECT * FROM users WHERE secretcode='${code}' AND email='${email}'`
		);
		if (result == null || result.length <= 0) {
			return false;
		}
		return true;
	};
	delete_profile = async (email) => {
		const result1 = await this.DATABASE.fetch(
			`SELECT profile FROM users WHERE email='${email}'`
		);
		const pname = result1[0].profile;
		if (pname == "" || pname == null) {
			return;
		}
		const result = await this.DATABASE.fetch(
			`UPDATE users SET profile='' WHERE email='${email}'`
		);
		if (result.changedRows > 0) {
			let uploadPath = __dirname + "/upload/" + pname;
			fs.unlinkSync(uploadPath);
		}
		return;
	};
	change_profile = async (email, profile) => {
		let result = { changedRows: 0 };
		if (profile == undefined || profile == null) return result;
		let ext = profile.name.split(".")[1];
		let fileName = email + "-profile." + ext;
		let uploadPath = __dirname + "/upload/" + fileName;
		await this.delete_profile(email);
		await profile.mv(uploadPath, (err) => err && console.log(err));
		result = await this.DATABASE.fetch(
			`UPDATE users SET profile='${fileName}' WHERE email='${email}'`
		);
		return result;
	};
	change_password = async (email, password, repass) => {
		if (
			!this.valid.password(password) ||
			!this.valid.samepass(password, repass)
		) {
			return false;
		}
		const result = await this.DATABASE.fetch(
			`UPDATE users SET password='${password}' WHERE email='${email}'`
		);
		if (result == null || result.length <= 0 || result.changedRows <= 0) {
			return false;
		}
		return true;
	};
	change_info = async (email, dname, password, profile, secret) => {
		if (
			!this.valid.email(email) ||
			!this.valid.password(password) ||
			!this.valid.text(dname, "Display Name") ||
			!this.valid.text(secret, "Secret Code")
		) {
			return false;
		}
		const result = await this.change_profile(email, profile);
		const result1 = await this.DATABASE.fetch(
			`UPDATE users SET password='${password}' WHERE email='${email}'`
		);
		const result2 = await this.DATABASE.fetch(
			`UPDATE users SET username='${dname}' WHERE email='${email}'`
		);
		const result3 = await this.DATABASE.fetch(
			`UPDATE users SET secretcode='${secret}' WHERE email='${email}'`
		);
		if (
			result.changedRows <= 0 &&
			result1.changedRows <= 0 &&
			result2.changedRows <= 0 &&
			result3.changedRows <= 0
		) {
			this.valid.msgh.text = "X Error: No changes have been made!";
			return false;
		}
		localStorage.setItem(
			"user",
			`email: ${email.toLowerCase()}|password: ${password}`
		);
		this.valid.msgh.text = "Success: User information have been changed.";
		return true;
	};
	verify_password = async (email, password) => {
		const result = await this.DATABASE.fetch(
			`SELECT * FROM users WHERE password='${password}' AND email='${email}'`
		);
		if (result == null || result.length <= 0) {
			return false;
		}
		return true;
	};
	login = async (email, password) => {
		if (!this.valid.email(email) || !this.valid.password(password)) {
			return false;
		}
		let email_exists = await this.exists("email", email);
		let pass_exists = await this.verify_password(email, password);
		if (!email_exists) {
			this.valid.msgh.text =
				"X Error: User with this email address does not exist!";
			return false;
		}
		if (!pass_exists) {
			this.valid.msgh.text =
				"X Error: Password does not match with this email address!";
			return false;
		}
		return true;
	};
	register = async (
		user,
		displayname,
		email,
		password,
		repass,
		secret_code
	) => {
		if (
			!this.valid.code(secret_code, "Secret Code") ||
			!this.valid.text(user, "Username") ||
			!this.valid.text(displayname, "Display Name") ||
			!this.valid.email(email) ||
			!this.valid.password(password) ||
			!this.valid.samepass(password, repass)
		) {
			return false;
		}
		let name_exists = await this.exists("name", user);
		let email_exists = await this.exists("email", email);
		if (name_exists) {
			this.valid.msgh.text = "X Error: User with this name already exists!";
			return false;
		}
		if (email_exists) {
			this.valid.msgh.text = "X Error: User with this email already exists!";
			return false;
		}
		const result = await this.DATABASE.fetch(
			`INSERT INTO users(name, username, email, password, role, secretcode) VALUES ('${user}', '${displayname}', '${email}', '${password}', '${Role.default}', '${secret_code}'
			)`
		);
		if (result === null) return false;
		return true;
	};
};
