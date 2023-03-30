const router = require("express").Router();
const { join } = require("node:path");
const { writeFile, access, mkdir, readdir, rm } = require("node:fs/promises");
const clientDb = require("../connectDb");


router.post("/postBlogImg", async (req, res) => {
	const dbTokRes = await clientDb.collection("token").findOne({tokenId: 1});
	const currToken = dbTokRes.tokenString;
	if (req.cookies?.token != currToken) {
		res.render("loggedOut");
		return;
	}
	if (req.body?.img && req.body?.Id) {
		const imgData = req.body.img.match("data:(image/.*);base64,(.*)");
		const ext = imgData[1].split("/")[1];
		const imgDir = join(__dirname, "..", "public", "images", "blogImg", req.body.Id);

		try {
			await access(imgDir);
			const prevImg = await readdir(imgDir);
			if (!prevImg.length) { await rm(join(imgDir, prevImg[0])); }
		} catch { await mkdir(imgDir); }

		await writeFile(
			join(imgDir, `blogImg.${ext}`),
			Buffer.from(imgData[2], "base64")
		);

		res.send({data: `${req.body.Id} blog image uploaded`});
	} else {
		res.send({err: "postBlogImg body incorrect"});
	}
});

module.exports = router;