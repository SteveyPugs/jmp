var express = require("express");
var lodash = require("lodash");
var router = express.Router();
var models = require("../models");

router.get("/", function (req, res) {
	if(lodash.isEmpty(req.cookies)){
		res.send("Access Denied");
	}
	else{
		models.Grievance.findAll({
			where:{
				deletedAt: null,
				TenantID: req.cookies.TenantID
			},
			attributes: ["GrievanceID", "GrievanceStatus", "createdAt", "updatedAt"],
			include:[{
				model: models.GrievanceCategory,
				attributes: ["GrievanceCategory"]
			},{
				model: models.GrievanceMessage,
				attributes: ["GrievanceMessage", "GrievanceMessageSide"]
			}],
			order: [[{
				model: models.GrievanceMessage
			}, "createdAt", "DESC"]]
		}).then(function(grievances){
			res.send(grievances)
		}).catch(function(err){
			res.send(err.stack);
		});
	}
});

router.post("/", function (req, res) {
	if(lodash.isEmpty(req.cookies)){
		res.send("Access Denied");
	}
	else{
		models.Grievance.create({
			GrievanceStatus: false,
			GrievanceCategoryID: req.body.GrievanceCategoryID,
			TenantID: req.cookies.TenantID 
		}).then(function(new_record){
			models.GrievanceMessage.create({
				GrievanceMessage: req.body.GrievanceMessage,
				GrievanceMessageSide: false,
				GrievanceID: new_record.GrievanceID 
			}).then(function(new_message){
				res.send(true);
			}).catch(function(err){
				res.send(err.stack);
			});
		}).catch(function(err){
			res.send(err.stack);
		});
	}
});

router.get("/categories", function (req, res) {
	if(lodash.isEmpty(req.cookies)){
		res.send("Access Denied");
	}
	else{
		models.GrievanceCategory.findAll({
			where:{
				deletedAt: null
			},
			raw: true,
			attributes: ["GrievanceCategory", "GrievanceCategoryID"]
		}).then(function(grievancecategories){
			res.send(grievancecategories)
		}).catch(function(err){
			res.send(err.stack);
		});
	}
});

module.exports = router;