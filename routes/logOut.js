const router = require("express").Router();

router.get("/logOut", async (req, res) => {
	res.clearCookie("token");
	res.redirect("adminLogin");
});

module.exports = router;