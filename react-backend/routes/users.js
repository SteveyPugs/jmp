var express = require('express');
var router = express.Router();
var models = require("../models");
console.log()

router.post("/", function(req, res, next){
	console.log(req.body);
	models.User.create({
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
