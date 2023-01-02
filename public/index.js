require("dotenv").config();
const path = require("path");
const cors = require("cors");
const express = require("express");
const serverless = require('serverless-http');
const bodyParser = require("body-parser");
//////////////////////////////////////////
const app = express();
const router = express.Router();
const PORT = process.env.PORT || 8000;
const Database = require("./js/sql");
const publicDir = path.join(__dirname, "public");
/////////////////////////////////////////////////
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/.netlify/functions/server', router);
// STATIC LINKS
app.use(express.static(publicDir));
///////////////////////////////////
// CONNECT TO THE DATABASE
const DATABASE = new Database();
// APP ROUTES
const { main_route: BandsController } = require("../routes/BandsController");
const {
	main_route: FeedbacksController,
} = require("../routes/FeedbackController");
const { main_route: AdminController } = require("../routes/AdminsController");
const { main_route: LikesController } = require("../routes/LikesController");
app.use(BandsController);
app.use(AdminController);
app.use(LikesController);
app.use(FeedbacksController);
module.exports = { DATABASE, app, PORT };
module.exports.handler = serverless(app);