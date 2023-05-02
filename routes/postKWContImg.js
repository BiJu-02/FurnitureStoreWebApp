const express = require("express");
const path = require("node:path");
const { writeFile, readdir, rm } = require("node:fs/promises");
const { Buffer } = require("node:buffer");
const clientDb = require("../connectDb");
		
const router = express.Router();

router.post("/postKWContImg", async (req, res) => {
	const dbTokRes = await clientDb.collection("token").findOne({tokenId: 1});
	const currToken = dbTokRes.tokenString;
	if (req.cookies?.token != currToken) {
		res.render("loggedOut");
		return;
	}
	if (
		req.body?.data?.type && req.body?.data?.subType && req.body?.data?.idx 
		&& req.body?.data?.img && req.body?.data?.imgIdx
	) {
		try {
			const data = req.body.data;
			const imgData = data.img.match('data:(image/.*);base64,(.*)');
    		const ext = imgData[1].split("/")[1];
    		const imgDir = path.join(
							__dirname, "..",
							"public", "images", 
							data.type, data.subType, data.idx,
							"imgArr"
						);
    		const imgArr = await readdir(imgDir);
    		for (let img of imgArr) {
    			if (img.startsWith(data.imgIdx)) {
    				await rm(path.join(imgDir, img));
    			}
    		}
			await writeFile(
				path.join(imgDir, `${data.imgIdx}.${ext}`),
    			Buffer.from(imgData[2], "base64")
    		);
			res.send({data: `${data.imgIdx} image uploaded`});
		} catch (er) {
			console.log(er);
			res.send({err: `program errored: ${er}`})
		}
	} else {
		res.send({err: "img post body incorrect"});
		console.log("ded contImg post");
	}
});

module.exports = router;
