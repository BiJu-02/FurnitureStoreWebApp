const express = require("express");
const { readdir } = require("node:fs/promises");
const { join } = require("node:path");
const router = express.Router();

router.get("/kitchenWardrobePage", async (req, res) => {
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
						thumb = thumb[0];
						pageData[subType][i] = thumb ? `./images/${type}/${subType}/${i}/thumbnail/${thumb}` : "";
					})());
				});
			}
			await Promise.all(promList);
			pageData["type"] = type;
			console.log(pageData);
			res.render("kitchenWardrobePage", {pageData});
		} catch (err) {
			console.log(err);
			res.send({data: "db errored"});
		}
	} else {
		res.send({err: "did not get kwType query"});
	}
});

module.exports = router;