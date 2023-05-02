const router = require("express").Router();
const { ObjectId } = require("mongodb");
const { readdir, access } = require("node:fs/promises");
const { join } = require("node:path");

router.get("/blogPost", async (req, res) => {
	if (req.query?.Id) {
		const clientDb = require("../connectDb");
		const blogDoc = await clientDb
								.collection("dummy3")
								.findOne({_id: new ObjectId(req.query.Id)});
		// get blogImg
		let blogImgDir = join(__dirname, "..", "public", "images", "blogImg", req.query.Id);
		let blogImgArr = null;
		let imgUrl = [];
		for (let i=0; i<5; i++) { imgUrl[i] = ""; }
		try {
			await access(blogImgDir);
			blogImgArr = await readdir(blogImgDir);
			imgUrl[0] = `./images/blogImg/${req.query.Id}/${blogImgArr[0]}`;
		} catch {}

		blogImgDir = join(__dirname, "..", "public", "images", "blogImgArr", req.query.Id);
		try {
			await access(blogImgDir);
			blogImgArr = await readdir(blogImgDir);
			for (let x of blogImgArr) {
				let i = parseInt(x[0]);
				imgUrl[i] = `./images/blogImgArr/${req.query.Id}/${x}`;
			}
		} catch {}

		const data = {blog: blogDoc, img: imgUrl};
		console.log(data);
		if (req.query?.api) {
			res.send(data);
		} else {
			res.render("blogPost", data);
		}
	} else {
		res.send({err: "blogPost query Id not found"});
	}
});

module.exports = router;