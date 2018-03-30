var express = require("express");
var bcrypt = require("bcrypt");
var router = express.Router();
var models = require("../models");

router.post("/landlord", function (req, res) {
	models.Landlord.find({
		where:{
			LandlordEmail: req.body.LandlordEmail
		},
		raw: true
	}).then(function(landlord){
		if(bcrypt.compareSync(req.body.LandlordPassword, landlord.LandlordPassword)){
			res.cookie("LandLordID", landlord.LandlordID);
			res.redirect("/dashboard/landlord");
		}
		else{
			res.redirect("/fail");
		}
	}).catch(function(err){
		res.send(err.stack);
	});	
});

router.get("/landlord/logout", function(req, res) {
	res.clearCookie("LandLordID");
	res.redirect("/");
});

module.exports = router;