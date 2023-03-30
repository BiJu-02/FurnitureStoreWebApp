const express = require("express");

const router = express.Router();

router.get("/adminLogin", async (req, res) => {
	res.render("adminLogin");
});

module.exports = router;