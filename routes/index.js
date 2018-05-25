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

router.get("/support", function (req, res) {
	if(lodash.isEmpty(req.cookies)){
		res.render("support", { title: "Support",
			Landlord: false,
			Tenant: false
		});
	}
	else{
		if(req.cookies.TenantID){
			res.render("support", { title: "Support",
				Landlord: false,
				Tenant: true
			});
		}
		else{
			res.render("support", { title: "Support",
				Landlord: true,
				Tenant: false
			});
		}
	}	
});

module.exports = router;