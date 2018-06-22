var express = require("express");
var lodash = require("lodash");
var async = require("async");
var Chance = require("chance");
var bcrypt = require("bcrypt");
var models = require("../models");
var router = express.Router();

router.get("/", function (req, res) {
	res.render("index", { title: "Home" });
});

router.get("/forgot", function (req, res) {
	res.render("forgot", { title: "Forgot Password" });
});

router.post("/forgot", function (req, res) {
	async.parallel({
		landlord: function(callback){
			models.Landlord.find({
				where:{
					LandlordEmail: req.body.Email,
					deletedAt: null
				},
				raw: true
			}).then(function(landlord){
				return callback(null, landlord);
			}).catch(function(err){
				return callback(err);
			});
		},
		tenant: function(callback){
			models.Tenant.find({
				where:{
					TenantEmail: req.body.Email,
					deletedAt: null
				},
				raw: true
			}).then(function(tenant){
				return callback(null, tenant);
			}).catch(function(err){
				return callback(err);
			});
		}
	}, function(err, results){
		if(err) return res.send(err);
		var chance = new Chance();
		var password = chance.word({ length: 10 }).toUpperCase();
		console.log(password)
		if(results.landlord){
			models.Landlord.update({
				LandlordPassword: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
			},{
				where:{
					LandlordID: results.landlord.LandlordID,
				}
			}).then(function(landlord){
				res.redirect("/reset");
			}).catch(function(err){
				res.send(err.stack);
			});		
		}
		else if(results.tenant){
			models.Tenant.update({
				TenantPassword: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
			},{
				where:{
					TenantID: results.tenant.TenantID
				}
			}).then(function(landlord){
				res.redirect("/reset");
			}).catch(function(err){
				res.send(err.stack);
			});
		}
		else res.redirect("/reset");
	});
});

router.get("/reset", function (req, res) {
	res.render("reset", { title: "Password Reset" });
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