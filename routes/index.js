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
	models.User.find({
		where:{
			UserEmail: req.body.Email,
			deletedAt: null
		},
		raw: true
	}).then(function(user){
		var chance = new Chance();
		var password = chance.word({ length: 10 }).toUpperCase();
		console.log(password)
		if(user){
			models.User.update({
				UserPassword: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
			},{
				where:{
					UserID: user.UserID
				}
			}).then(function(user){
				res.redirect("/reset");
			}).catch(function(err){
				res.send(err.stack);
			});
		}
		else res.redirect("/reset");
	}).catch(function(err){
		return callback(err);
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
		models.User.find({
			where:{
				UserID: req.cookies.UserID
			},
			raw: true
		}).then(function(user){
			console.log(user)
			switch(user.UserLevel){
				case 2:
					res.render("support", { title: "Support",
						Landlord: true,
						Tenant: false
					});
					break;
				case 3:
					res.render("support", { title: "Support",
						Landlord: false,
						Tenant: true
					});
					break;
			}
		}).catch(function(){
			res.send(err);
		});
	}	
});

module.exports = router;