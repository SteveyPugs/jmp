var express = require("express");
var lodash = require("lodash");
var bcrypt = require("bcrypt");
var Chance = require("chance");
var models = require("../models");
var router = express.Router();

router.post("/", function (req, res) {
	var chance = new Chance();
	if(lodash.isEmpty(req.cookies)){
		res.send("Access Denied");
	}
	else{
		var password = chance.word({ length: 10 }).toUpperCase();
		console.log(password)
		models.Tenant.create({
			TenantOptOut: req.body.TenantEmail ? false : true,
			TenantEmail: req.body.TenantEmail ? req.body.TenantEmail : null,
			TenantPassword: req.body.TenantEmail ? bcrypt.hashSync(password, bcrypt.genSaltSync(10)) : null,
			TenantFullName: req.body.TenantName
		}).then(function(tenant){
			models.UnitTenant.create({
				UnitID: req.body.UnitID,
				TenantID: tenant.TenantID
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
	}
});

module.exports = router;