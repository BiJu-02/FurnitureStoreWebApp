const router = require("express").Router();
const { ObjectId } = require("mongodb");
const clientDb = require("../connectDb");

router.post("/postBlog", async (req, res) => {
	const dbTokRes = await clientDb.collection("token").findOne({tokenId: 1});
	const currToken = dbTokRes.tokenString;
	if (req.cookies?.token != currToken) {
		res.render("loggedOut");
		return;
	}
	if (req.body?.head && req.body?.cont) {

		let tempId = 0;
		if (req.body.Id) { tempId = req.body.Id; }
		const dbResult = await clientDb.collection("dummy3").updateOne(
			{ _id: new ObjectId(tempId) },
			{
				$set: {
					bHead: req.body.head,
					bCont: req.body.cont
				}
			},
			{ upsert: true }
		);
		if (dbResult.acknowledged) {
			if (dbResult.upsertedCount) {
				// for create
				res.send({data: dbResult.upsertedId.toString()});
			} else {
				// for update
				if (dbResult.modifiedCount) {
					res.send({updateSuccess: true, modified: true});
				} else {
					res.send({updateSuccess: true, modified: false});
				}
			}
		} else {
			res.send({err: "could not update db"});
		}
	} else {
		res.send({err: "postBlog body incorrect"});
	}
});

module.exports = router;