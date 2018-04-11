var express = require("express");
var bcrypt = require("bcrypt");
var router = express.Router();
var models = require("../models");

router.post("/landlord", function (req, res) {
	models.Landlord.find({
		where:{
			LandlordEmail: req.body.LandlordEmail
		},
		raw: true
	}).then(function(landlord){
		if(landlord && bcrypt.compareSync(req.body.LandlordPassword, landlord.LandlordPassword)){
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
			TenantEmail: req.body.TenantEmail
		},
		raw: true
	}).then(function(tenant){
		if(tenant && bcrypt.compareSync(req.body.TenantPassword, tenant.TenantPassword)){
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

module.exports = router;