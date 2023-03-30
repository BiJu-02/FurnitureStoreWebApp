const express = require("express");
const { writeFile, mkdir } = require("node:fs/promises");
const path = require("node:path");

const router = express.Router();
const clientDb = require("../connectDb");

router.post("/postKWContent", async (req, res) => {
	const dbTokRes = await clientDb.collection("token").findOne({tokenId: 1});
	const currToken = dbTokRes.tokenString;
	if (req.cookies?.token != currToken) {
		res.render("loggedOut");
		return;
	}
	if (req.body.data) {
		const data = req.body.data;
		if (!(
			data.type && data.subType && data.idx
			&& data.title && data.head && data.subHead
			&& data.para1 && data.para2
		)) {
			res.send({data: "post body incorrect"});
			return;
		}
		try{
			const dbResult = await clientDb.collection("dummy2").updateOne(
				{
					kwType: data.type,
					kwSubType: data.subType,
					kwIdx: data.idx
				},
				{
					$set: {
						kwTitle: data.title,
						kwType: data.type,
						kwSubType: data.subType,
						kwIdx: data.idx,
						kwHead: data.head,
						kwSubHead: data.subHead,
						kwPara1: data.para1,
						kwPara2: data.para2
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
						res.send({data: {updateSuccess: true}});
					} else {
						res.send({data: {updateSuccess: false}});
					}
				}
			} else {
				res.send({err: "could not update db"});
			}
                } catch (err) {
                        console.log(err);
                        res.send({err: "program error"});
                }
        } else {
                res.send({err: "no post body received"});
        }
});

module.exports = router;
