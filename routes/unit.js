var express = require("express");
var lodash = require("lodash");
var models = require("../models");
var router = express.Router();

router.get("/:PropertyID", function (req, res) {
	if(lodash.isEmpty(req.cookies)){
		res.send("Access Denied");
	}
	else{
		models.Unit.findAll({
			where:{
				PropertyID: req.params.PropertyID
			},
			include:[{
				model: models.UnitTenant,
				where:{
					deletedAt: null
				},
				required: false,
				attributes: [],
				include:[{
					model: models.Tenant,
					attributes: ["TenantEmail", "TenantFullName", "TenantID", "TenantOptOut"]
				}]
			}],
			order: ["UnitTag"],
			nest: true,
			raw: true
		}).then(function(units){
			res.send(units);
		}).catch(function(err){
			console.log(err);
			res.send(err);
		});
	}
});


module.exports = router;