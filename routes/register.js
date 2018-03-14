var express = require("express")
var router = express.Router();

// define the home page route
router.get("/", function (req, res) {
	res.render("register", { title: "Registration" });
});

router.post("/", function (req, res) {
	res.send(req.body);
});

module.exports = router;