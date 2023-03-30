const express = require("express");
const { readdir } = require("node:fs/promises");
const path = require("node:path");
const { ObjectId } = require("mongodb");

const router = express.Router();

router.get("/contentPage", async (req, res) => {
	if (req.query?.kwType && req.query?.kwSubType && req.query?.kwIdx) {
                 try {
                         const clientDb = require("../connectDb");
                         const kwCont = await clientDb
                                                  .collection("dummy2")
                                                  .findOne(
                                                         {
                                                                kwType: req.query.kwType,
                                                                kwSubType: req.query.kwSubType,
                                                                kwIdx: req.query.kwIdx
                                                         }
                                                   );
			 const imgArr = await readdir(path.join(
                                __dirname, "..", 
                                "public", "images", 
                                `${kwCont.kwType}`, `${kwCont.kwSubType}`, `${kwCont.kwIdx}`,
                                "imgArr"
                        ));
                         const dirPath = `./images/${kwCont.kwType}/${kwCont.kwSubType}/${kwCont.kwIdx}/imgArr`;
                         const imgPath = {};
                         for (let i of imgArr) {
                                imgPath[i.split(".")[0]] = `${dirPath}/${i}`;
                         }
                         res.render("contentPage", {cont: kwCont, img: imgPath});
                 } catch (err) {
                         console.log(err);
                         res.send({data: "db errored"});
                 }
         } else {
                 res.send({data: "no kwId in query"});
                 console.log("ded get req");
         }
});

module.exports = router;
