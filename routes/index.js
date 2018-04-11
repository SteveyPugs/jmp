var express = require("express");
var lodash = require("lodash");
var models = require("../models");
var router = express.Router();

router.get("/", function (req, res) {
	res.render("index", { title: "Home" });
});

router.get("/dashboard/landlord", function (req, res) {
	if(lodash.isEmpty(req.cookies)){
		res.redirect("/");
	}
	else{
		res.render("landlord_dashboard", { title: "Landlord Dashboard" });
	}
});

router.get("/dashboard/tenant", function (req, res) {
	if(lodash.isEmpty(req.cookies)){
		res.redirect("/");
	}
	else{
		res.render("tenant_dashboard", { title: "Tenant Dashboard" });
	}
});

router.get("/dashboard/landlord/property", function (req, res) {
	if(lodash.isEmpty(req.cookies)){
		res.redirect("/");
	}
	else{
		res.render("landlord_dashboard_property", { title: "Landlord Dashboard - Property" });
	}
});

module.exports = router;