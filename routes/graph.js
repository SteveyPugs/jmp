var express = require("express");
var lodash = require("lodash");
var moment = require("moment");
var models = require("../models");
var router = express.Router();
var security = require("./security");

router.get("/units", security.signedIn, function (req, res) {	
	models.Property.findAll({
		where:{
			UserID: req.cookies.UserID
		},
		raw: true,
		attributes:["PropertyID"]
	}).then(function(properties){
		var listOfProperties = lodash.map(properties, "PropertyID");
		models.Unit.findAll({
			where:{
				PropertyID: listOfProperties
			},
			raw: true
		}).then(function(units){
			res.send({
				Vacant: lodash.filter(units, {
					UnitVacant: 1
				}).length,
				Filled: lodash.filter(units, {
					UnitVacant: 0
				}).length 
			});
		}).catch(function(err){
			res.send(err.stack);
		});
	}).catch(function(err){
		res.send(err.stack);
	});
});

router.get("/grievances", security.signedIn, function (req, res) {
	models.Property.findAll({
		where:{
			UserID: req.cookies.UserID
		},
		raw: true,
		attributes:["PropertyID"]
	}).then(function(properties){
		var listOfProperties = lodash.map(properties, "PropertyID");
		models.Unit.findAll({
			where:{
				PropertyID: listOfProperties
			},
			raw: true
		}).then(function(units){
			var listOfUnits = lodash.map(units, "UnitID");
			models.UnitTenant.findAll({
				where:{
					UnitID: listOfUnits
				},
				raw: true
			}).then(function(tenants){
				var listOfTenants = lodash.map(tenants, "TenantID");
				models.Grievance.findAll({
					where:{
						deletedAt: null,
						createdAt: {
							$gte: "2018/05/03"
						}
					},
					raw: true
				}).then(function(grievances){
					res.send({
						Closed: lodash.filter(grievances, {
							GrievanceStatus: 1
						}).length,
						Open: lodash.filter(grievances, {
							GrievanceStatus: 0
						}).length 
					});
				}).catch(function(err){
					res.send(err.stack);
				});
			}).catch(function(err){
				res.send(err.stack);
			});
		}).catch(function(err){
			res.send(err.stack);
		});
	}).catch(function(err){
		res.send(err.stack);
	});
});

router.get("/payments", security.signedIn, function (req, res) {
	models.Property.findAll({
		where:{
			UserID: req.cookies.UserID
		},
		raw: true
	}).then(function(properties){
		var listOfProperties = lodash.map(properties, "PropertyID");
		models.Unit.findAll({
			where:{
				PropertyID: listOfProperties
			},
			raw: true
		}).then(function(units){
			var listOfUnits = lodash.map(units, "UnitID");
			models.UnitTenant.findAll({
				where:{
					UnitID: listOfUnits
				},
				raw: true
			}).then(function(users){
				var listOfUsers = lodash.map(users, "UserID");
				models.Payment.findAll({
					where:{
						deletedAt:{
							$eq: null
						},
						createdAt:{
							$gte: moment().startOf("month").format("YYYY-MM-DD HH:mm:ss"),
							$lte: moment().endOf("month").format("YYYY-MM-DD HH:mm:ss")
						},
						UserID: listOfUsers
					},
					raw: true
				}).then(function(payments){
					res.send({
						Paid: payments.length,
						Unpaid: listOfUsers.length - payments.length
					});
				}).catch(function(err){
					res.send(err.stack);
				});
			}).catch(function(err){
				res.send(err.stack);
			});
		}).catch(function(err){
			res.send(err.stack);
		});
	}).catch(function(err){
		res.send(err.stack);
	});
});

module.exports = router;