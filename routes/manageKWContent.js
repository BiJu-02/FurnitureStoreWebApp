const express = require("express");
const { readdir } = require("node:fs/promises");
const { join } = require("node:path");
const clientDb = require("../connectDb");
const router = express.Router();

router.get("/manageKWContent", async (req, res) => {
	// security stuff here
	const dbTokRes = await clientDb.collection("token").findOne({tokenId: 1});
	const currToken = dbTokRes.tokenString;
	if (req.cookies?.token != currToken) {
		res.render("loggedOut");
		return;
	}
	if (req.query.kwType) {
		try {
			const type = req.query.kwType;
			const idx = ["0", "1", "2"];
			let pageData = {
				"mrq": {},
				"cls": {},
				"cnt": {},
				"mdn": {}
			}


			const promList = [];
			for(const subType in pageData) {
				idx.forEach((i) => {
					let imgPath = join(
						__dirname, "..",
						"public", "images", 
						type, subType, i, "thumbnail"
					);
					promList.push((async ()=> {
						let thumb = await readdir(imgPath);
						const kwDoc = await clientDb
											.collection("dummy2")
											.findOne({
												kwType: type,
												kwSubType: subType,
												kwIdx: i
											});
						thumb = thumb[0];
						pageData[subType][i] = {};
						pageData[subType][i]["img"] = thumb ? `./images/${type}/${subType}/${i}/thumbnail/${thumb}` : "";
						pageData[subType][i]["url"] = `http://radiancekitchens.com/radapi/editKWContent?kwType=${type}&kwSubType=${subType}&kwIdx=${i}`;
						pageData[subType][i]["delOpt"] = kwDoc ? `"${type}", "${subType}", "${i}"` : "";
					})());
				});
			}
			await Promise.all(promList);
			pageData["type"] = type;
			console.log(pageData);
			res.render("manageKWContent", {pageData});
		} catch (err) {
			console.log(err);
			res.send({data: "db errored"});
		}
	} else {
		res.send({err: "did not get kwType query"});
	}
});

module.exports = router;