var express = require("express");
var lodash = require("lodash");
var async = require("async");
var Chance = require("chance");
var bcrypt = require("bcrypt");
var path = require("path");
var models = require("../models");
var security = require("./security");
var router = express.Router();

router.get("/dashboard/landlord", security.signedIn, function (req, res){
	res.sendFile(path.resolve(__dirname + "/../" + "/static/index.html"));
});

router.get("/dashboard/landlord/graphs", security.signedIn, function (req, res){
	res.sendFile(path.resolve(__dirname + "/../" + "/static/index.html"));
});

router.get("/dashboard/tenant", security.signedIn, function (req, res){
	res.sendFile(path.resolve(__dirname + "/../" + "/static/index.html"));
});

router.get("/support", function (req, res) {
	res.sendFile(path.resolve(__dirname + "/../" + "/static/index.html"));
});

router.get("/login", function (req, res) {
	res.sendFile(path.resolve(__dirname + "/../" + "/static/index.html"));
});

router.get("/register/complete", function (req, res) {
	res.sendFile(path.resolve(__dirname + "/../" + "/static/index.html"));
});

router.get("/reset", function (req, res) {
	res.sendFile(path.resolve(__dirname + "/../" + "/static/index.html"));
});

router.post("/login", function (req, res) {
	models.User.find({
		where:{
			UserEmail: req.body.Email
		},
		raw: true
	}).then(function(user){
		if(user && bcrypt.compareSync(req.body.Password, user.UserPassword)){
			res.cookie("UserID", user.UserID);
			res.send(user.UserLevel.toString());
		}
		else{
			res.send(false);
		}
	}).catch(function(err){
		res.send(err.stack);
	});	
});

router.get("/logout", function(req, res) {
	res.clearCookie("UserID");
	res.redirect("/");
});

router.get("/register", function (req, res) {
	res.sendFile(path.resolve(__dirname + "/../" + "/static/index.html"));
});

router.post("/register", function (req, res) {
	var chance = new Chance();
	models.User.count({
		where:{
			UserEmail: req.body.RegisterEmail
		},
		raw: true
	}).then(function(user){
		if(user > 0){
			res.send(false);
		}
		else{
			var password = chance.word({ length: 10 }).toUpperCase();
			console.log(password)
			models.User.create({
				UserEmail: req.body.RegisterEmail,
				UserPassword: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
				UserFullName: req.body.RegisterFullName,
				UserLevel: 2
			}).then(function(user){
				models.Property.create({
					PropertyAddress: req.body.RegisterAddress,
					PropertyCity: req.body.RegisterCity,
					PropertyZip: req.body.RegisterZip,
					PropertyState: req.body.RegisterState,
					PropertyUnitCount: req.body.RegisterNumberOfUnits,
					PropertyType: req.body.RegisterTypeOptions,
					UserID: user.UserID,
					PropertyResidentialType: req.body.ResidentialTypeSelect
				}).then(function(property){
					var units = [];
					lodash.times(req.body.RegisterNumberOfUnits, function(v){
						units.push({
							UnitTag: v + 1,
							PropertyID: property.PropertyID
						});
					});
					models.Unit.bulkCreate(units).then(function(units){
						res.send(true);
					}).catch(function(err){
						res.send(err.stack);
					});
				}).catch(function(err){
					res.send(err.stack);
				});
			}).catch(function(err){
				res.send(err.stack);
			});
		}
	}).catch(function(err){
		res.send(err.stack);
	});
});

router.get("/forgot", function (req, res) {
	res.sendFile(path.resolve(__dirname + "/../" + "/static/index.html"));
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
				res.send(true);
			}).catch(function(err){
				res.send(err.stack);
			});
		}
		else res.send(true);
	}).catch(function(err){
		return callback(err);
	});
});

module.exports = router;