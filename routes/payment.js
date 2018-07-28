var express = require("express");
var lodash = require("lodash");
var moment = require("moment");
var async = require("async");
var sequelize = require("sequelize");
var models = require("../models");
var config = require("../config");
var router = express.Router();
var security = require("./security");
var stripe = require("stripe")(config.stripe.secret_key);

router.get("/", security.signedIn, function(req, res) {
	models.Payment.findAndCountAll({
		where:{
			UserID: req.cookies.UserID,
			deletedAt: null
		},
		limit: 5,
		raw: true,
		nest: true,
		offset: req.query.offset > 0 ? parseInt(req.query.offset) : null,
		order: [["createdAt", "DESC"]]
	}).then(function(payments){
		var startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
		var endOfMonth = moment().endOf("month").format("YYYY-MM-DD");
		var isPaid = lodash.find(payments.rows, function(row){
			var paymentDate = moment(row.createdAt).format("YYYY-MM-DD");
			if(moment(paymentDate).isBefore(endOfMonth) && moment(paymentDate).isAfter(startOfMonth)){
				return true;
			}
		});
		payments.isMonthPaid = isPaid ? true : false;
		async.eachSeries(payments.rows, function(payment, callback){
			stripe.charges.retrieve(payment.PaymentConfirmationCode, function(err, charge){
				if(err) return callback(err);
				payment.Last4 = charge.source.last4;
				payment.Brand = charge.source.brand;
				payment.PaymentAmount = charge.amount / 100;
				return callback(null, null);
			});
		}, function(err){
			if(err) res.send(err);
			else res.send(payments);
		});
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
		limit: 5,
		raw: true,
		nest: true,
		order: [["createdAt", "DESC"]]
	}).then(function(payments){
		async.eachSeries(payments, function(payment, callback){
			stripe.charges.retrieve(payment.PaymentConfirmationCode, function(err, charge){
				if(err) return callback(err);
				payment.Last4 = charge.source.last4;
				payment.Brand = charge.source.brand;
				payment.PaymentAmount = charge.amount / 100;
				return callback(null, null);
			});
		}, function(err){
			if(err) res.send(err);
			else res.send(payments);
		});
	}).catch(function(err){
		res.send(err);
	});
});

router.post("/", security.signedIn, function (req, res) {
	const charge = stripe.charges.create({
		amount: req.body.PaymentAmount * 100,
		currency: "usd",
		description: "Rent Payment",
		source: req.body.token
	}, function(err, result){
		if(err) return res.send(err);
		models.Payment.create({
			PaymentConfirmationCode: result.id,
			UserID: req.cookies.UserID
		}).then(function(payment){
			res.send(true);
		}).catch(function(err){
			res.send(err);
		});
	});
});

module.exports = router;