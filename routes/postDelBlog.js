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
			const blogImgDir = join(__dirname, "..", "public", "images", "blogImg", req.body.Id);
			await access(blogImgDir)
			try {
				await rm(blogImgDir, { recursive: true });
			} catch {
				res.send({err: "image deletion failed"});
			}
		} catch {}
		res.send({deletionSuccess: true});
	} else {
		res.send({err: "postDelBlog body incorrect no Id received"});
	}
});

module.exports = router;