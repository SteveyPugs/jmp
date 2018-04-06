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