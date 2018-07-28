var express = require("express");
var lodash = require("lodash");
var models = require("../models");
var router = express.Router();
var security = require("./security");

router.get("/property/:PropertyID", security.signedIn, function (req, res) {
	models.Unit.findAll({
		where:{
			PropertyID: req.params.PropertyID
		},
		include:[{
			model: models.UnitTenant,
			where:{
				deletedAt: null
			},
			required: false,
			attributes: [],
			include:[{
				model: models.User,
				attributes: ["UserEmail", "UserFullName", "UserID"]
			}]
		}],
		order: ["UnitTag"],
		nest: true,
		raw: true
	}).then(function(units){
		res.send(units);
	}).catch(function(err){
		res.send(err);
	});
});

router.get("/rent", security.signedIn, function (req, res) {
	models.UnitTenant.find({
		where:{
			UserID: req.cookies.UserID
		},
		raw: true
	}).then(function(unitteant){
		models.Unit.find({
			where:{
				UnitID: unitteant.UnitID
			},
			raw: true
		}).then(function(unit){
			res.send(unit);
		}).catch(function(err){
			res.send(err);
		});
	}).catch(function(err){
		res.send(err);
	});
});

module.exports = router;