const router = require("express").Router();
const clientDb = require("../connectDb");
const { ObjectId } = require("mongodb");

router.post("/postDelBlog", async (req, res) => {
	const dbTokRes = await clientDb.collection("token").findOne({tokenId: 1});
	const currToken = dbTokRes.tokenString;
	if (req.cookies?.token != currToken) {
		res.render("loggedOut");
		return;
	}
	if (req.body?.Id) {
		const dbResult = await clientDb
								.collection("dummy3")
								.deleteOne({_id: new ObjectId(req.body.Id)});
		if (!dbResult.deletedCount) {
			res.send({err: "no deletion"});
			return;
		}
		try {
			const { rm, access } = require("node:fs/promises");
			const { join } = require("node:path");
			let blogImgDir = join(__dirname, "..", "public", "images", "blogImg", req.body.Id);
			try {
				await access(blogImgDir)
				await rm(blogImgDir, { recursive: true });
			} catch {
				res.send({err: "thumb image deletion failed"});
			}
			blogImgDir = join(__dirname, "..", "public", "images", "blogImgArr", req.body.Id);
			try {
				await access(blogImgDir)
				await rm(blogImgDir, { recursive: true });
			} catch {
				res.send({err: "image array deletion failed"});
			}
		} catch(e) {
			console.log(e);
			res.send({err: "program errored"})
		}
		res.send({deletionSuccess: true});
	} else {
		res.send({err: "postDelBlog body incorrect no Id received"});
	}
});

module.exports = router;