var express = require("express");
var bcrypt = require("bcrypt");
var path = require("path");
var router = express.Router();
var models = require("../models");

router.get("/", function (req, res) {
	res.sendFile(path.resolve(__dirname + "/../" + "/static/index.html"));
});

router.post("/", function (req, res) {
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
	// res.sendFile(path.resolve(__dirname + "/../" + "/static/index.html"));
});

module.exports = router;