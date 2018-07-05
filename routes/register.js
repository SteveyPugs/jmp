var express = require("express");
var bcrypt = require("bcrypt");
var Chance = require("chance");
var lodash = require("lodash");
var router = express.Router();
var models = require("../models");

router.get("/", function (req, res) {
	res.render("register", { title: "Registration" });
});

router.get("/sorry", function (req, res) {
	res.render("register_sorry", { title: "Registration - Sorry" });
});

router.get("/complete", function (req, res) {
	res.render("register_complete", { title: "Registration - Complete" });
});

router.post("/", function (req, res) {
	var chance = new Chance();
	models.User.count({
		where:{
			UserEmail: req.body.RegisterEmail
		},
		raw: true
	}).then(function(user){
		if(user > 0){
			res.redirect("/register/sorry");
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
					PropertyResidentialType: req.body.ResidentialType
				}).then(function(property){
					var units = [];
					lodash.times(req.body.RegisterNumberOfUnits, function(v){
						units.push({
							UnitTag: v + 1,
							PropertyID: property.PropertyID
						});
					});
					models.Unit.bulkCreate(units).then(function(units){
						res.redirect("/register/complete");
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

module.exports = router;