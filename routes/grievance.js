var express = require("express");
var lodash = require("lodash");
var router = express.Router();
var models = require("../models");
var security = require("./security");

router.post("/", security.signedIn, function (req, res) {
	models.Grievance.create({
		GrievanceStatus: false,
		GrievanceCategoryID: req.body.GrievanceCategoryID,
		UserID: req.cookies.UserID 
	}).then(function(new_record){
		models.GrievanceMessage.create({
			GrievanceMessage: req.body.GrievanceMessage,
			GrievanceMessageSide: false,
			GrievanceID: new_record.GrievanceID 
		}).then(function(new_message){
			res.send(true);
		}).catch(function(err){
			res.send(err);
		});
	}).catch(function(err){
		res.send(err);
	});
});

router.delete("/:GrievanceID", security.signedIn, function (req, res) {
	models.Grievance.update({
		GrievanceStatus: true
	},{
		where:{
			GrievanceID: req.params.GrievanceID
		}
	}).then(function(updated_record){
		res.send(true);
	}).catch(function(err){
		res.send(err);
	});
});

router.post("/message/:side", security.signedIn, function (req, res) {
	models.GrievanceMessage.create({
		GrievanceMessage: req.body.GrievanceMessage,
		GrievanceMessageSide: req.params.side === "tenant" ? false : true,
		GrievanceID: req.body.GrievanceID 
	}).then(function(new_message){
		res.send(true);
	}).catch(function(err){
		res.send(err);
	});
});

router.get("/categories", security.signedIn, function (req, res) {
	models.GrievanceCategory.findAll({
		where:{
			deletedAt: null
		},
		raw: true,
		attributes: ["GrievanceCategory", "GrievanceCategoryID"]
	}).then(function(grievancecategories){
		res.send(grievancecategories)
	}).catch(function(err){
		res.send(err);
	});
});

router.get("/tenant/:UserID", security.signedIn, function (req, res) {
	models.Grievance.findAll({
		where:{
			deletedAt: null,
			UserID: req.params.UserID
		},
		attributes: ["GrievanceID", "createdAt", "updatedAt", "UserID", "GrievanceStatus"],
		include:[{
			model: models.GrievanceCategory,
			attributes: ["GrievanceCategory"]
		}],
	}).then(function(grievances){
		res.send(grievances)
	}).catch(function(err){
		res.send(err);
	});
});

router.get("/:status", security.signedIn, function (req, res) {
	models.Grievance.findAndCountAll({
		where:{
			deletedAt: null,
			UserID: req.cookies.UserID,
			GrievanceStatus: (req.params.status === "open" ? false : true)
		},
		attributes: ["GrievanceID", "createdAt", "updatedAt", "GrievanceCode"],
		include:[{
			model: models.GrievanceCategory,
			attributes: ["GrievanceCategory"]
		}],
	}).then(function(grievances){
		res.send(grievances)
	}).catch(function(err){
		res.send(err);
	});
});

router.get("/messages/:id", security.signedIn, function (req, res) {
	var grievance = {}
	models.Grievance.find({
		where:{
			GrievanceID: req.params.id
		},
		raw: true
	}).then(function(grievance){
		models.GrievanceMessage.findAll({
			where:{
				deletedAt: null,
				GrievanceID: req.params.id
			},
			raw: true, 
			order: [["createdAt", "DESC"]]
		}).then(function(messages){
			grievance.messages = messages
			res.send(grievance)
		}).catch(function(err){
			res.send(err);
		});
	}).catch(function(err){
		res.send(err);
	});
});

module.exports = router;