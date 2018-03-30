var express = require("express");
var lodash = require("lodash");
var models = require("../models");
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


module.exports = router;