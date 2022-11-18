require("dotenv").config();
const path = require("path");
const express = require("express");
const bodyParser = require('body-parser');
const fileupload = require("express-fileupload");
const { LocalStorage } = require("node-localstorage");
const { main_route } = require("./routes/main_route");
const { myaccount_route } = require("./routes/myaccount_route");
const { login_route } = require("./routes/login_route");
const { signout_route } = require("./routes/signout_route");
const { register_route } = require("./routes/register_route");
const { dashboard_route } = require("./routes/dashboard_route");
const { resetpass_route } = require("./routes/resetpass_route");
////////////////////////////////////////////////////////////////
const app = express();
const PORT = process.env.PORT || 8000;
const Database = require("./public/js/sql");
const publicDir = path.join(__dirname, "public");
/////////////////////////////////////////////////
app.use(fileupload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// STATIC LINKS
app.use(express.static(publicDir));
app.use("/js", express.static(path.join(__dirname, "public/js")));
app.use("/css", express.static(path.join(__dirname, "public/css")));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
//////////////////////////////////////////////////////////////////////////
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// CONNECT TO THE DATABASE
const DATABASE = new Database();
// APP ROUTES
app.use(main_route);
app.use(login_route);
app.use(signout_route);
app.use(register_route);
app.use(resetpass_route);
app.use(myaccount_route);
app.use(dashboard_route);
// 404 ROUTE
app.use("/", (req, res) =>
	res.render("404", { title: "PAGE TITLE HERE | Page not found :(" })
);
// LISTENING TO THE PORT
app.listen(PORT, () => console.log(`Listening on the port: ${PORT}`));
module.exports = { DATABASE };
