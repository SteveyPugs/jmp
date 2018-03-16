var express = require("express")
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
	models.Landlord.count({
		where:{
			LandlordEmail: req.body.RegisterEmail
		},
		raw: true
	}).then(function(landlord){
		console.log(landlord)
		if(landlord > 0){
			res.redirect("/register/sorry");
		}
		else{
			models.Landlord.create({
				LandlordEmail: req.body.RegisterEmail,
				LandlordPassword: "test",
				LandlordFullName: req.body.RegisterFullName
			}).then(function(landlord){
				models.Property.create({
					PropertyAddress: req.body.RegisterAddress,
					PropertyCity: req.body.RegisterCity,
					PropertyZip: req.body.RegisterZip,
					PropertyState: req.body.RegisterState,
					PropertyUnitCount: req.body.RegisterNumberOfUnits,
					PropertyType: req.body.RegisterTypeOptions,
					LandlordID: landlord.LandlordID
				}).then(function(property){
					res.redirect("/register/complete");
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