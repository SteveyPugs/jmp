var express = require("express");
var lodash = require("lodash");
var router = express.Router();

router.get("/", function (req, res) {
	res.render("index", { title: "Home" });
});

router.get("/dashboard/landlord", function (req, res) {
	if(lodash.isEmpty(req.cookies)){
		res.redirect("/");
	}
	else{
		res.render("landlord_dashboard", { title: "Home" });
	}
});

module.exports = router;