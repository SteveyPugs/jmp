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