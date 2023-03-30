const router = require("express").Router();
const { readdir } = require("node:fs/promises");
const { join } = require("node:path");
const clientDb = require("../connectDb");

router.get("/editBlog", async (req, res) => {
	// token shiz
	const dbTokRes = await clientDb.collection("token").findOne({tokenId: 1});
	const currToken = dbTokRes.tokenString;
	if (req.cookies?.token == currToken) {
		let bId = "";
		if (req.query?.Id) {
			bId = req.query?.Id;
		}

		res.render("editBlog", {Id: bId});
	} else {
		res.render("loggedOut");
	}
});

module.exports = router;