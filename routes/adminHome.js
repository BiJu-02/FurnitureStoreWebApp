const router = require("express").Router();
const { join } = require("node:path");
const { readdir } = require("node:fs/promises");
const clientDb = require("../connectDb");

router.get("/adminHome", async (req, res) => {
	const dbTokRes = await clientDb.collection("token").findOne({tokenId: 1});
	const currToken = dbTokRes.tokenString;
	if (req.cookies.token == currToken) {

		try {
			const bList = [];
			const clientDb = require("../connectDb");
			const blgList = await clientDb.collection("dummy3").find({}, {projection: {}}).toArray();
			const imgList = {};
			const blogImgDir = join(__dirname, "..", "public", "images", "blogImg");
			try {
				const dirList = await readdir(blogImgDir);
				for (let idDir of dirList) {
					const imgFile = await readdir(join(blogImgDir, idDir));
					imgList[idDir] = `./images/blogImg/${idDir}/${imgFile[0]}`
				}
			} catch {}
			res.render("adminHome", {blog: blgList, img: imgList});
		} catch (err) {
			console.log(err);
			res.send({err: "program errored"});
		}
	} else {
		res.render("loggedOut");
	}
});

module.exports = router;