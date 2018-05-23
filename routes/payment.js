var express = require("express");
var lodash = require("lodash");
var moment = require("moment");
var sequelize = require("sequelize");
var models = require("../models");
var router = express.Router();

router.get("/", function(req, res) {
	if(lodash.isEmpty(req.cookies)){
		res.send("Access Denied");
	}
	else{
		models.Payment.findAndCountAll({
			where:{
				TenantID: req.cookies.TenantID,
				deletedAt: null
			},
			include: [{
				model: models.PaymentOption,
				paranoid: false,
				attributes: ["PaymentTypeID"]
			}],
			limit: 5,
			raw: true,
			nest: true,
			offset: req.query.offset > 0 ? parseInt(req.query.offset) : null,
			order: [["createdAt", "DESC"]],
			attributes:["PaymentAmount","PaymentConfirmationCode", "createdAt"]
		}).then(function(payments){
			res.send(payments);
		}).catch(function(err){
			res.send(err);
		});
	}
});

router.get("/tenant/:TenantID", function(req, res) {
	if(lodash.isEmpty(req.cookies)){
		res.send("Access Denied");
	}
	else{
		models.Payment.findAll({
			where:{
				TenantID: req.params.TenantID,
				deletedAt: null
			},
			include: [{
				model: models.PaymentOption,
				paranoid: false,
				attributes: ["PaymentTypeID"]
			}],
			limit: 5,
			raw: true,
			nest: true,
			order: [["createdAt", "DESC"]],
			attributes:["PaymentAmount", "createdAt"]
		}).then(function(payments){
			res.send(payments);
		}).catch(function(err){
			res.send(err);
		});
	}
});

router.get("/option", function (req, res) {
	if(lodash.isEmpty(req.cookies)){
		res.send("Access Denied");
	}
	else{
		models.PaymentOption.find({
			where:{
				TenantID: req.cookies.TenantID,
				deletedAt: null
			},
			attributes: ["PaymentCCNumber","PaymentCheckAccount"],
			raw: true
		}).then(function(paymentoption){
			if(paymentoption.PaymentCCNumber){
				paymentoption.PaymentCCNumber = paymentoption.PaymentCCNumber.substring(paymentoption.PaymentCCNumber.length - 4, paymentoption.PaymentCCNumber.length);
			}
			else{
				paymentoption.PaymentCheckAccount = paymentoption.PaymentCheckAccount.substring(paymentoption.PaymentCheckAccount.length - 4, paymentoption.PaymentCheckAccount.length);	
			}
			res.send(paymentoption);
		}).catch(function(err){
			res.send(err);
		});
	}
});

router.get("/options", function (req, res) {
	if(lodash.isEmpty(req.cookies)){
		res.send("Access Denied");
	}
	else{
		models.PaymentOption.findAll({
			where:{
				TenantID: req.cookies.TenantID,
				deletedAt: null
			},
			raw: true
		}).then(function(paymentoptions){
			lodash.forEach(paymentoptions, function(paymentoption){
				if(paymentoption.PaymentCCNumber){
					paymentoption.PaymentCCNumber = paymentoption.PaymentCCNumber.substring(paymentoption.PaymentCCNumber.length - 4, paymentoption.PaymentCCNumber.length);
				}
				else{
					paymentoption.PaymentCheckAccount = paymentoption.PaymentCheckAccount.substring(paymentoption.PaymentCheckAccount.length - 4, paymentoption.PaymentCheckAccount.length);	
				}
			});
			res.send(paymentoptions);
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
		models.Payment.create({
			PaymentAmount: req.body.PaymentAmount,
			PaymentOptionID: req.body.PaymentOptionID,
			TenantID: req.cookies.TenantID
		}).then(function(payment){
			res.send(true);
		}).catch(function(err){
			res.send(err.stack);
		});
	}
});

router.post("/option", function (req, res) {
	if(lodash.isEmpty(req.cookies)){
		res.send("Access Denied");
	}
	else{
		models.PaymentOption.update({
			deletedAt: moment().format("YYYY-MM-DD HH:mm:ss")
		},{
			where:{
				TenantID: req.cookies.TenantID
			}
		}).then(function(property){		
			models.PaymentOption.create({
				PaymentCCNumber: req.body.PaymentOptionCreditCardNumber,
				PaymentCCExpiration: req.body.PaymentOptionCreditCardExpiration,
				PaymentCCVerification: req.body.PaymentOptionCreditCardCVV,
				PaymentCheckRouting: req.body.PaymentOptionCheckingRouting,
				PaymentCheckAccount: req.body.PaymentOptionCheckingAccount,
				PaymentTypeID: req.body.PaymentOptionCreditCardNumber ? 1 : 2,
				TenantID: req.cookies.TenantID
			}).then(function(property){
				res.send(true);
			}).catch(function(err){
				res.send(err.stack);
			});
		}).catch(function(err){
			res.send(err.stack);
		});
	}
});

module.exports = router;