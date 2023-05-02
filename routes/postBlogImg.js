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
	if (req.body?.img && req.body?.Id && (req.body?.Type || req.body?.Idx)) {
		const imgData = req.body.img.match("data:(image/.*);base64,(.*)");
		const ext = imgData[1].split("/")[1];
		let imgDir = "";

		if (req.body.Type == "t") {
			imgDir = join(__dirname, "..", "public", "images", "blogImg", req.body.Id);
		} else {
			imgDir = join(__dirname, "..", "public", "images", "blogImgArr", req.body.Id);
		}

		try { await access(imgDir); }
		catch { await mkdir(imgDir); }

		const prevImg = await readdir(imgDir);
		console.log(imgDir, prevImg);
		if (req.body.Type == "t") {
			if (prevImg.length) { await rm(join(imgDir, prevImg[0])); }
			await writeFile(
				join(imgDir, `blogImg.${ext}`),
				Buffer.from(imgData[2], "base64")
			);
			res.send({data: `${req.body.Id} blog thumb image uploaded`});
		} else {
			for (let img of prevImg) {
    			if (img.startsWith(req.body.Idx)) {
    				await rm(join(imgDir, img));
    			}
    		}
    		await writeFile(
				join(imgDir, `${req.body.Idx}.${ext}`),
				Buffer.from(imgData[2], "base64")
			);
			res.send({data: `${req.body.Id} blog image ${req.body.Idx} uploaded`});
		}

	} else {
		res.send({err: "postBlogImg body incorrect"});
	}
});

module.exports = router;