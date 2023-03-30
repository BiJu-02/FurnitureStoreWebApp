const express = require("express");
const path = require("node:path");
const { writeFile, readdir, rm } = require("node:fs/promises");
const { Buffer } = require("node:buffer");
const clientDb = require("../connectDb");

const router = express.Router();

router.post("/postKWThumb", async (req, res) => {
	const dbTokRes = await clientDb.collection("token").findOne({tokenId: 1});
	const currToken = dbTokRes.tokenString;
	if (req.cookies?.token != currToken) {
		res.render("loggedOut");
		return;
	}
	if (
		req.body?.data?.type && req.body?.data?.subType && req.body?.data?.idx 
		&& req.body?.data?.thumb
	) {
		const data = req.body.data;
		const imgData = data.thumb.match('data:(image/.*);base64,(.*)');
		const ext = imgData[1].split("/")[1];
		console.log(ext);
		const imgDir = path.join(
				__dirname, "..",
				"public", "images",
				`${data.type}`, `${data.subType}`, `${data.idx}`,
				"thumbnail"
			)
		const imArr = await readdir(imgDir);
		console.log("imgArr length", imArr.length);
		if (imArr.length) { await rm(path.join(imgDir, imArr[0])); }
		await writeFile(
			path.join(imgDir, `thumb.${ext}`),
			Buffer.from(imgData[2], "base64")
		);
		res.send({data: `${data.idx} ${data.subType} ${data.type} thumbnail uploaded`});
	} else {
		res.send({err: "no post body received"});
	}
});

module.exports = router;
