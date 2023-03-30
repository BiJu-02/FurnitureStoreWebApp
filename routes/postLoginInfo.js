const router = require("express").Router();
const clientDb = require("../connectDb");
const tokenGen = require("../tokenGen");

router.post("/postLoginInfo", async (req, res) => {
	if (req.body?.pass) {
		console.log(req.body.pass);
		if (req.body.pass == "radiance123") {
			const options = {
				secure: true,
				httpOnly: true,
				sameSite: "lax"
			};
			if (req.body.remember) { options.maxAge = 259200; }
			// generate token and store in db
			const newToken = tokenGen();
			const dbTokRes = await clientDb
									.collection("token")
									.updateOne(
										{tokenId: 1},
										{$set: {tokenString: newToken}}
									);
			res.cookie("token", newToken, options);
			res.send({data: "passed"});
		} else {
			res.send({data: "failed"});
		}
	} else {
		res.send({err: "login info post body incorrect"});
	}
});

module.exports = router;