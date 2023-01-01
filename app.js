require("dotenv").config();
const path = require("path");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
//////////////////////////////////////////
const app = express();
const PORT = process.env.PORT || 8000;
const Database = require("./public/js/sql");
const publicDir = path.join(__dirname, "public");
/////////////////////////////////////////////////
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// STATIC LINKS
app.use(express.static(publicDir));
///////////////////////////////////
// CONNECT TO THE DATABASE
const DATABASE = new Database();
// APP ROUTES
const { main_route: BandsController } = require("./routes/BandsController");
const {
	main_route: FeedbacksController,
} = require("./routes/FeedbackController");
const { main_route: AdminController } = require("./routes/AdminsController");
app.use(BandsController);
app.use(AdminController);
app.use(FeedbacksController);
// LISTENING TO THE PORT
app.listen(PORT, () => console.log(`Listening on the port: ${PORT}`));
module.exports = { DATABASE };
