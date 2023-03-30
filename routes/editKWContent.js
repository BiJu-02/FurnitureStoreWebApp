const router = require("express").Router();
const clientDb = require("../connectDb");

router.get("/editKWContent", async (req, res) => {
	const dbTokRes = await clientDb.collection("token").findOne({tokenId: 1});
	const currToken = dbTokRes.tokenString;
	if (req.cookies?.token != currToken) {
		res.render("loggedOut");
		return;
	}
	if (req.query?.kwType && req.query?.kwSubType && req.query?.kwIdx) {
		try {
             const { readdir } = require("node:fs/promises");
             const { join } = require("node:path");
             let kwCont = await clientDb
                                      .collection("dummy2")
                                      .findOne(
	                                         {
	                                            kwType: req.query.kwType,
	                                            kwSubType: req.query.kwSubType,
	                                            kwIdx: req.query.kwIdx
	                                         }
                                       );
             let imgPath = {};
             if (kwCont) {

				 const imgArr = await readdir(join(
				                    __dirname, "..", 
				                    "public", "images", 
				                    `${kwCont.kwType}`, `${kwCont.kwSubType}`, `${kwCont.kwIdx}`,
				                    "imgArr"
				            ));
	             const dirPath = `./images/${kwCont.kwType}/${kwCont.kwSubType}/${kwCont.kwIdx}/imgArr`;
	             for (let i of imgArr) {
	                    imgPath[i.split(".")[0]] = `<img src="${dirPath}/${i}">`;
	             }
             } else {
             	kwCont = {
             		kwType: req.query.kwType,
	                kwSubType: req.query.kwSubType,
	                kwIdx: req.query.kwIdx,
             		kwTitle: "Title",
             		kwHead: "Enter heading here",
             		kwSubHead: "Enter subheading here",
             		kwPara1: "Enter paragraph 1 here",
             		kwPara2: "Enter paragraph 2 here"
             	};
             	imgPath = {};
             	for (let i=0; i<5; i++) {
             		for (let j=0; j<5; j++) {
             			imgPath[`${i}${j}`] = "";
             		}
             	}
             }
             res.render("editKWContent", {cont: kwCont, img: imgPath});
	     } catch (err) {
	             console.log(err);
	             res.send({data: "db errored"});
	     }
	} else {
		res.send({err: "editKWContent query not correct"});
	}
});

module.exports = router;