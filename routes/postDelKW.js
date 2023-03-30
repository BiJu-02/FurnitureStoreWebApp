const router = require("express").Router();
const clientDb = require("../connectDb");
const { ObjectId } = require("mongodb");

router.post("/postDelKW", async (req, res) => {
	const dbTokRes = await clientDb.collection("token").findOne({tokenId: 1});
	const currToken = dbTokRes.tokenString;
	if (req.cookies?.token != currToken) {
		res.render("loggedOut");
		return;
	}
	if (req.body?.kwidx && req.body?.kwtype && req.body?.kwsubtype) {

		const dbResult = await clientDb
								.collection("dummy2")
								.deleteOne({
									kwType: req.body.kwtype,
									kwSubType: req.body.kwsubtype,
									kwIdx: req.body.kwidx
								});
		if (!dbResult.deletedCount) {
			res.send({err: "no deletion"});
			return;
		}
		const { rm, mkdir } = require("node:fs/promises");
		const { join } = require("node:path");
		const imgArrDir = join(__dirname, "..", "public", "images", req.body.kwtype, req.body.kwsubtype, req.body.kwidx);
		try {
			await rm(join(imgArrDir, "imgArr"), { recursive: true });
			await rm(join(imgArrDir, "thumbnail"), { recursive: true });
			await mkdir(join(imgArrDir, "imgArr"));
			await mkdir(join(imgArrDir, "thumbnail"));
		} catch (err) {
			console.log(err);
			res.send({err: "image deletion failed"});
			return;
		}
		res.send({deletionSuccess: true});
	} else {
		res.send({err: "postDelKW body incorrect"});
	}
});

module.exports = router;