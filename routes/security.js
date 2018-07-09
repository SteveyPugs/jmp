var express = require("express");
var lodash = require("lodash");
var internals = {};

internals.signedIn = function(req, res, next){
	if(!lodash.isEmpty(req.cookies)){
		next();
	}
	else{
		res.redirect("/");
	}
};

module.exports = internals;