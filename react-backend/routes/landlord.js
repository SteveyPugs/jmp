var express = require('express');
var router = express.Router();
var models = require("../models");

router.get("/verify", function(req, res, next){
	models.LandLord.count({
		where:{
			Email: req.query.Email
		}
	}).then(c => {
		res.json(c);
	}).catch(function(err){
		res.status(500).send(err)
	});
});

router.post("/", function(req, res, next){
	models.LandLord.create({
		FullName: req.body.Name,
		Address: req.body.Address,
		City: req.body.City,
		State: req.body.State,
		NumberOfUnits: req.body.NumberOfUnits,
		Email: req.body.Email,
		PropertyTypeId: req.body.ClientType,
		Password: "TEST"
	}).then(function(){
		res.json("done");
	}).catch(function(err){
		res.status(500).send(err)
	});
});

module.exports = router;
