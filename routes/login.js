var express = require("express");
var bcrypt = require("bcrypt");
var router = express.Router();
var models = require("../models");

router.post("/", function (req, res) {
	models.User.find({
		where:{
			UserEmail: req.body.Email
		},
		raw: true
	}).then(function(user){
		if(user && bcrypt.compareSync(req.body.Password, user.UserPassword)){
			res.cookie("UserID", user.UserID);
			switch(user.UserLevel){
				case 1:
					//fill in later
					break;
				case 2:
					res.redirect("/dashboard/landlord");
					break;
				case 3:
					res.redirect("/dashboard/tenant");
					break;
			} 
		}
		else{
			res.redirect("/fail");
		}
	}).catch(function(err){
		res.send(err.stack);
	});	
});

router.get("/logout", function(req, res) {
	res.clearCookie("UserID");
	res.redirect("/");
});

router.get("/landlord", function(req, res) {
	res.render("login", {
		title: "Landlord"
	});
});

router.get("/tenant", function(req, res) {
	res.render("login", {
		title: "Tenant"
	});
});

module.exports = router;