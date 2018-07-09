var express = require("express");
var lodash = require("lodash");
var moment = require("moment");
var sequelize = require("sequelize");
var models = require("../models");
var router = express.Router();
var security = require("./security");

router.get("/", security.signedIn, function(req, res) {
	models.Payment.findAndCountAll({
		where:{
			UserID: req.cookies.UserID,
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
});

router.get("/tenant/:UserID", security.signedIn, function(req, res) {
	models.Payment.findAll({
		where:{
			UserID: req.params.UserID,
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
});

router.get("/option", security.signedIn, function (req, res) {
	models.PaymentOption.find({
		where:{
			UserID: req.cookies.UserID,
			deletedAt: null
		},
		attributes: ["PaymentCCNumber","PaymentCheckAccount"],
		raw: true
	}).then(function(paymentoption){
		if(paymentoption){
			if(paymentoption.PaymentCCNumber){
				paymentoption.PaymentCCNumber = paymentoption.PaymentCCNumber.substring(paymentoption.PaymentCCNumber.length - 4, paymentoption.PaymentCCNumber.length);
			}
			else{
				paymentoption.PaymentCheckAccount = paymentoption.PaymentCheckAccount.substring(paymentoption.PaymentCheckAccount.length - 4, paymentoption.PaymentCheckAccount.length);	
			}
		}
		res.send(paymentoption);
	}).catch(function(err){
		res.send(err);
	});
});

router.get("/options", security.signedIn, function (req, res) {
	models.PaymentOption.findAll({
		where:{
			UserID: req.cookies.UserID,
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
});

router.post("/", security.signedIn, function (req, res) {
	models.Payment.create({
		PaymentAmount: req.body.PaymentAmount,
		PaymentOptionID: req.body.PaymentOptionID,
		UserID: req.cookies.UserID
	}).then(function(payment){
		res.send(true);
	}).catch(function(err){
		res.send(err);
	});
});

router.post("/option", security.signedIn, function (req, res) {
	models.PaymentOption.update({
		deletedAt: moment().format("YYYY-MM-DD HH:mm:ss")
	},{
		where:{
			UserID: req.cookies.UserID
		}
	}).then(function(property){		
		models.PaymentOption.create({
			PaymentCCNumber: req.body.PaymentOptionCreditCardNumber,
			PaymentCCExpiration: req.body.PaymentOptionCreditCardExpiration,
			PaymentCCVerification: req.body.PaymentOptionCreditCardCVV,
			PaymentCheckRouting: req.body.PaymentOptionCheckingRouting,
			PaymentCheckAccount: req.body.PaymentOptionCheckingAccount,
			PaymentTypeID: req.body.PaymentOptionCreditCardNumber ? 1 : 2,
			UserID: req.cookies.UserID
		}).then(function(property){
			res.send(true);
		}).catch(function(err){
			res.send(err);
		});
	}).catch(function(err){
		res.send(err);
	});
});

module.exports = router;