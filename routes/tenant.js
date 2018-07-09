var express = require("express");
var lodash = require("lodash");
var moment = require("moment");
var bcrypt = require("bcrypt");
var Chance = require("chance");
var mime = require("mime");
var stream = require("stream");
var fs = require("fs");
var models = require("../models");
var router = express.Router();
var security = require("./security");

router.post("/", security.signedIn, function (req, res) {
	var chance = new Chance();
	var password = chance.word({ length: 10 }).toUpperCase();
	console.log(password)
	models.User.create({
		UserEmail: req.body.TenantEmail,
		UserPassword: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
		UserFullName: req.body.TenantName,
		UserLevel: 3
	}).then(function(user){
		models.UnitTenant.create({
			UnitID: req.body.UnitID,
			UserID: user.UserID
		}).then(function(unit_tenant){
			models.Unit.update({
				UnitVacant: false
			},{
				where:{
					UnitID: req.body.UnitID
				}
			}).then(function(unit){
				return res.send(true);
			}).catch(function(err){
				res.send(err);
			});
		}).catch(function(err){
			res.send(err);
		});
	}).catch(function(err){
		res.send(err);
	});
});

router.get("/unit/property", security.signedIn, function (req, res) {
	models.UnitTenant.find({
		where:{
			UserID: req.cookies.UserID
		},
		attributes: ["UnitID"],
		raw: true
	}).then(function(unittenant){
		models.Unit.find({
			where:{
				UnitID: unittenant.UnitID
			},
			attributes: ["PropertyID"],
			raw: true
		}).then(function(unit){
			res.send(unit);
		}).catch(function(err){
			res.send(err);
		});
	}).catch(function(err){
		res.send(err);
	});
});

router.get("/documents", security.signedIn, function (req, res) {
	models.Document.findAll({
		where:{
			UserID: req.cookies.UserID,
			deletedAt: null
		},
		raw: true,
		attributes:["DocumentID", "DocumentName", "createdAt"],
		order: [["createdAt", "DESC"]]
	}).then(function(documents){		
		res.send(documents);
	}).catch(function(err){
		res.send(err);
	});
});

router.get("/document/:DocumentID", security.signedIn, function (req, res) {
	models.Document.find({
		where:{
			DocumentID: req.params.DocumentID
		},
		raw: true,
		attributes:["DocumentName", "Document"]
	}).then(function(doc){
			var fileContents = Buffer.from(doc.Document, "base64");
		var mimetype = mime.getType(doc.DocumentName);
		res.setHeader("Content-disposition", "attachment; filename=" + doc.DocumentName);
		res.setHeader("Content-type", mimetype);
		var readStream = new stream.PassThrough();
		readStream.end(fileContents);
		readStream.pipe(res);
	}).catch(function(err){
		res.send(err);
	});
});

router.post("/document", security.signedIn, function (req, res) {
	fs.readFile(req.files.Document.path, function(err,data){
		if(err) return res.send(err);
		models.Document.create({
			DocumentName: req.files.Document.originalFilename,
			UserID: req.body.UserID,
			Document: data
		}).then(function(tenant){
			fs.unlink(req.files.Document.path, function(err){
				if(err) return res.send(err);
				return res.send(true);
			});
		}).catch(function(err){
			res.send(err);
		});
	});
});

module.exports = router;