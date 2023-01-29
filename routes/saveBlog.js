const express = require("express");
const fs = require("fs");

const router = express.Router();

router.post("/saveBlog", async (req, res) => {
    try {
        if (req.body.data) {
            fs.writeFile(
                `${__dirname}/../blogs/${req.body.data.Name}.txt`,
                req.body.data.Text,
                (err) => {console.log(err); },
            );
            res.send({data:"blog saved"});
        }
    } catch {
        console.log("sed...anyways...");
    }
});

module.exports = router;