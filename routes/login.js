var express = require("express");
var bcrypt = require("bcrypt");
var router = express.Router();
var models = require("../models");

router.post("/landlord", function (req, res) {
	models.Landlord.find({
		where:{
			LandlordEmail: req.body.Email
		},
		raw: true
	}).then(function(landlord){
		if(landlord && bcrypt.compareSync(req.body.Password, landlord.LandlordPassword)){
			res.cookie("LandLordID", landlord.LandlordID);
			res.redirect("/dashboard/landlord");
		}
		else{
			res.redirect("/fail");
		}
	}).catch(function(err){
		res.send(err.stack);
	});	
});

router.post("/tenant", function (req, res) {
	models.Tenant.find({
		where:{
			TenantEmail: req.body.Email
		},
		raw: true
	}).then(function(tenant){
		if(tenant && bcrypt.compareSync(req.body.Password, tenant.TenantPassword)){
			res.cookie("TenantID", tenant.TenantID);
			res.redirect("/dashboard/tenant");
		}
		else{
			res.redirect("/fail");
		}
	}).catch(function(err){
		res.send(err.stack);
	});	
});

router.get("/landlord/logout", function(req, res) {
	res.clearCookie("LandLordID");
	res.redirect("/");
});

router.get("/tenant/logout", function(req, res) {
	res.clearCookie("TenantID");
	res.redirect("/");
});

router.get("/landlord", function(req, res) {
	res.render("login", {
		title: "Login - Landlord",
		Landlord: true,
		Tenant: false
	});
});

router.get("/tenant", function(req, res) {
	res.render("login", {
		title: "Login - Tenant",
		Landlord: false,
		Tenant: true
	});
});

module.exports = router;