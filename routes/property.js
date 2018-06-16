var express = require("express");
var lodash = require("lodash");
var models = require("../models");
var moment = require("moment");
var wkhtmltopdf = require("wkhtmltopdf");
var router = express.Router();

router.get("/", function (req, res) {
	if(lodash.isEmpty(req.cookies)){
		res.send("Access Denied");
	}
	else{
		models.Property.findAll({
			where:{
				LandLordID: req.cookies.LandLordID
			},
			raw: true
		}).then(function(properties){
			res.send(properties);
		}).catch(function(err){
			res.send(err);
		});
	}
});

router.post("/", function (req, res) {
	if(lodash.isEmpty(req.cookies)){
		res.send("Access Denied");
	}
	else{
		models.Property.create({
			PropertyAddress: req.body.RegisterAddress,
			PropertyCity: req.body.RegisterCity,
			PropertyZip: req.body.RegisterZip,
			PropertyState: req.body.RegisterState,
			PropertyUnitCount: req.body.RegisterNumberOfUnits,
			PropertyType: req.body.RegisterTypeOptions,
			LandlordID: req.cookies.LandLordID,
			PropertyResidentialType: req.body.ResidentialType
		}).then(function(property){
			var units = [];
			lodash.times(req.body.RegisterNumberOfUnits, function(v){
				units.push({
					UnitTag: v + 1,
					PropertyID: property.PropertyID
				});
			});
			models.Unit.bulkCreate(units).then(function(units){
				res.send(true);
			}).catch(function(err){
				res.send(err.stack);
			});
		}).catch(function(err){
			res.send(err.stack);
		});
	}	
});

router.get("/contact/:PropertyID", function (req, res) {
	if(lodash.isEmpty(req.cookies)){
		res.send("Access Denied");
	}
	else{
		models.PropertyContact.findAll({
			where:{
				PropertyID: req.params.PropertyID
			},
			raw: true
		}).then(function(properties){
			res.send(properties);
		}).catch(function(err){
			res.send(err);
		});
	}
});

router.post("/contact", function (req, res) {
	if(lodash.isEmpty(req.cookies)){
		res.send("Access Denied");
	}
	else{
		models.PropertyContact.create({
			PropertyID: req.body.PropertyID,
			PropertyContactName: req.body.PropertyContactName,
			PropertyContactTelephone: req.body.PropertyContactTelephone
		}).then(function(contact){
			res.send(true);
		}).catch(function(err){
			res.send(err);
		});
	}
});

router.get("/lease/:PropertyID", function (req, res) {
	if(lodash.isEmpty(req.cookies)){
		res.send("Access Denied");
	}
	else{
		models.Lease.find({
			where:{
				deletedAt: null,
				PropertyID: req.params.PropertyID
			}
		}).then(function(lease){
			res.send(lease ? lease.LeaseTemplate : null);
		}).catch(function(err){
			res.send(err);
		});		
	}
});

router.post("/lease", function (req, res) {
	if(lodash.isEmpty(req.cookies)){
		res.send("Access Denied");
	}
	else{
		models.Lease.update({
			deletedAt: moment().format("YYYY-MM-DD HH:mm:ss")
		}, {
			where:{
				deletedAt: null,
				PropertyID: req.body.PropertyID
			}
		}).then(function(old){
			models.Lease.create({
				PropertyID: req.body.PropertyID,
				LeaseTemplate: req.body.LeaseTemplate
			}).then(function(contact){
				res.send(true);
			}).catch(function(err){
				res.send(err);
			});
		}).catch(function(err){
			res.send(err);
		});		
	}
});

router.get("/lease/:TenantID/:PropertyID", function (req, res) {
	if(lodash.isEmpty(req.cookies)){
		res.send("Access Denied");
	}
	else{
		models.Tenant.find({
			where:{
				TenantID: req.params.TenantID
			},
			attributes:["TenantEmail", "TenantFullName"],
			raw: true
		}).then(function(tenant){
			models.Lease.find({
				where:{
					PropertyID: req.params.PropertyID
				},
				raw: true
			}).then(function(lease){
				res.setHeader("Content-disposition", "attachment; filename='Lease_Agreement_" + tenant.TenantFullName.replace(" ", "_") +  ".pdf'")
				res.setHeader("Content-type", "application/pdf")
				wkhtmltopdf(lease.LeaseTemplate.replace("#FullName#", tenant.TenantFullName).replace("#Email#", tenant.TenantEmail)).pipe(res);
			}).catch(function(err){
				res.send(err);
			});
		}).catch(function(err){
			res.send(err);
		});
	}
});

module.exports = router;