const router = require("express").Router();

router.get("/loggedOut", (req, res) => {
	res.render("loggedOut");
});

module.exports = router;