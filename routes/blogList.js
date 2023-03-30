const router = require("express").Router();
const { join } = require("node:path");
const { readdir } = require("node:fs/promises");

router.get("/blogList", async (req, res) => {
	try {
		const bList = [];
		const clientDb = require("../connectDb");
		const blgList = await clientDb.collection("dummy3").find({}, {projection: {}}).toArray();
		const imgList = {};
		const blogImgDir = join(__dirname, "..", "public", "images", "blogImg");
		try {
			const dirList = await readdir(blogImgDir);
			for (let idDir of dirList) {
				const imgFile = await readdir(join(blogImgDir, idDir));
				imgList[idDir] = `./images/blogImg/${idDir}/${imgFile}`
			}
		} catch {}
		res.render("blogList", {blog: blgList, img: imgList});
	} catch (err) {
		console.log(err);
		res.send({err: "program errored"});
	}
});

module.exports = router;