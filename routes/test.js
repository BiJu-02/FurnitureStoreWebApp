const router = require("express").Router();

router.post("/test", async (req, res) => {
	const ip = req.headers["x-forwarded-for"];
	console.log(typeof(ip), ip);
	res.send("chill");
});

module.exports = router;