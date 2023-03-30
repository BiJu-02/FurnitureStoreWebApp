const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASS
	}
});
