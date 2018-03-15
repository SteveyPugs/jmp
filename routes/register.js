var express = require("express")
var router = express.Router();
var models = require("../models");

/*
NOTES
 - Add an email checker on the sign up page
 - Add a state autofiller (possibly city auto filler)
 - Add zip code as well
*/

router.get("/", function (req, res) {
	res.render("register", { title: "Registration" });
});

router.get("/complete", function (req, res) {
	res.render("register_complete", { title: "Registration - Complete" });
});

router.get("/check", function(req, res){
	models.Landlord.count({
		where:{
			LandlordEmail: req.query.email
		},
		raw: true
	}).then(function(landlord){
		console.log(landlord > 0 ? true : false);
	}).catch(function(err){
		res.send(err.stack);
	});
});

router.post("/", function (req, res) {
	models.Landlord.create({
		LandlordEmail: req.body.RegisterEmail,
		LandlordPassword: "test",
		LandlordFullName: req.body.RegisterFullName
	}).then(function(landlord){
		models.Property.create({
			PropertyAddress: req.body.RegisterAddress,
			PropertyCity: req.body.RegisterCity,
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
});

module.exports = router;