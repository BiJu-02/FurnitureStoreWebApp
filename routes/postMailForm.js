const express = require("express");

const router = express.Router();
const transporter = require("../mailer");
const clientDb = require("../connectDb");

router.post("/postMailForm", (req, res) => {
	if (req.body.data?.formText) {
		const data = req.body.data;
		// check in db
		// const ip = req.headers["x-forwarded-for"];
		// const dbRes = await clientDb.collection("clientUser").findOne({ipAd: ip});
		

		const mailOptions = {
			from: process.env.MAIL_USER,
			to: process.env.MAIL_USER,
			subject: "contact us form submission",
			text: data.formText
		};
		transporter.sendMail(mailOptions, (err, info) => {
			if (err) {
				res.send({data: "error occured while sending email"});
				console.log(err);
			} else {
				res.send({data: "mail send successfully"})
				console.log("email sent: " + info.response);
			}
		});
	} else {
		res.send({data: "no post body received"});
		return;
	}
});
module.exports = router;
