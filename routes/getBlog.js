const express = require("express");
const fs = require("fs");

const router = express.Router();

router.post("/getBlog", async (req, res) => {
    // try {
        if (req.body.data) {
                fs.readFile(`${__dirname}/../blogs/${req.body.data.title}.txt`,
                    "utf8",
                    (err, data) => {
                        if (err) { console.log(err); }
                        else {res.send({blogContent:data}); }
                    },
                );
        }
    // } catch {
    //     console.log("sed...anyways...");
    // }
});

module.exports = router;