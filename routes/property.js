var express = require("express");
var lodash = require("lodash");
var models = require("../models");
var router = express.Router();

router.get("/", function (req, res) {
	if(lodash.isEmpty(req.cookies)){
		res.send("Access Denied");
	}
	else{
		models.Property.findAll({
			where:{
				LandLordID: req.cookies.LandLordID
			},
			raw: true
		}).then(function(properties){
			res.send(properties);
		}).catch(function(err){
			res.send(err);
		});
	}
});

router.post("/", function (req, res) {
	if(lodash.isEmpty(req.cookies)){
		res.send("Access Denied");
	}
	else{
		models.Property.create({
			PropertyAddress: req.body.RegisterAddress,
			PropertyCity: req.body.RegisterCity,
			PropertyZip: req.body.RegisterZip,
			PropertyState: req.body.RegisterState,
			PropertyUnitCount: req.body.RegisterNumberOfUnits,
			PropertyType: req.body.RegisterTypeOptions,
			LandlordID: req.cookies.LandLordID
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
	}	
});


router.get("/contact/:PropertyID", function (req, res) {
	if(lodash.isEmpty(req.cookies)){
		res.send("Access Denied");
	}
	else{
		models.PropertyContact.findAll({
			where:{
				PropertyID: req.params.PropertyID
			},
			raw: true
		}).then(function(properties){
			res.send(properties);
		}).catch(function(err){
			res.send(err);
		});
	}
});

router.post("/contact", function (req, res) {
	if(lodash.isEmpty(req.cookies)){
		res.send("Access Denied");
	}
	else{
		models.PropertyContact.create({
			PropertyID: req.body.PropertyID,
			PropertyContactName: req.body.PropertyContactName,
			PropertyContactTelephone: req.body.PropertyContactTelephone
		}).then(function(contact){
			res.send(true);
		}).catch(function(err){
			res.send(err);
		});
	}
});

module.exports = router;