var config = require("../config");
var Sequelize = require("sequelize");
var sequelize = new Sequelize(config.database.database, config.database.user, config.database.password, {
	host: config.database.host,
	dialect: "mysql",
	logging: false,
	operatorsAliases: true
});

var models = [{
	name: "User",
	file: "user"
},{
	name: "Property",
	file: "property"
},{
	name: "Unit",
	file: "unit"
},{
	name: "UnitTenant",
	file: "unit_tenant"
},{
	name: "PropertyContact",
	file: "property_contact"
},{
	name: "PaymentOption",
	file: "paymentoption"
},{
	name: "Payment",
	file: "payment"
},{
	name: "GrievanceCategory",
	file: "grievance_category"
},{
	name: "Grievance",
	file: "grievance"
},{
	name: "GrievanceMessage",
	file: "grievance_message"
},{
	name: "Lease",
	file: "lease"
},{
	name: "Document",
	file: "document"
}];

models.forEach(function(model) {
	module.exports[model.name] = sequelize.import(__dirname + '/' + model.file);
});

sequelize.authenticate().then(function(err){
	if(err) console.log(err);
	(function(model){
		model.Property.belongsTo(model.User, {
			foreignKey: {
				name: "UserID",
				allowNull: false
			}
		});
		model.Unit.belongsTo(model.Property, {
			foreignKey: {
				name: "PropertyID",
				allowNull: false
			}
		});
		model.PropertyContact.belongsTo(model.Property, {
			foreignKey: {
				name: "PropertyID",
				allowNull: false
			}
		});
		model.Unit.hasMany(model.UnitTenant, {
			foreignKey: {
				name: "UnitID",
				allowNull: false
			}
		});
		model.UnitTenant.belongsTo(model.Unit, {
			foreignKey: {
				name: "UnitID",
				allowNull: false
			}
		});
		model.User.hasMany(model.UnitTenant, {
			foreignKey: {
				name: "UserID",
				allowNull: false
			}
		});
		model.UnitTenant.belongsTo(model.User, {
			foreignKey: {
				name: "UserID",
				allowNull: false
			}
		});
		model.PaymentOption.belongsTo(model.User, {
			foreignKey: {
				name: "UserID",
				allowNull: false
			}
		});
		model.PaymentOption.hasMany(model.Payment, {
			foreignKey: {
				name: "PaymentOptionID",
				allowNull: true
			}
		});
		model.Payment.belongsTo(model.PaymentOption, {
			foreignKey: {
				name: "PaymentOptionID",
				allowNull: true
			}
		});
		model.User.hasMany(model.Payment, {
			foreignKey: {
				name: "UserID",
				allowNull: false
			}
		});
		model.Payment.belongsTo(model.User, {
			foreignKey: {
				name: "UserID",
				allowNull: false
			}
		});
		model.User.hasMany(model.Grievance, {
			foreignKey: {
				name: "UserID",
				allowNull: false
			}
		});
		model.Grievance.belongsTo(model.User, {
			foreignKey: {
				name: "UserID",
				allowNull: false
			}
		});
		model.Grievance.belongsTo(model.GrievanceCategory, {
			foreignKey: {
				name: "GrievanceCategoryID",
				allowNull: false
			}
		});
		model.Grievance.hasMany(model.GrievanceMessage, {
			foreignKey: {
				name: "GrievanceID",
				allowNull: false
			}
		});
		model.Lease.belongsTo(model.Property, {
			foreignKey: {
				name: "PropertyID",
				allowNull: false
			}
		});
		model.Document.belongsTo(model.User, {
			foreignKey: {
				name: "UserID",
				allowNull: false
			}
		});
		sequelize.sync({
			force: false
		}).then(function(){
			model.GrievanceCategory.count({
				where:{
					deletedAt: null
				}
			}).then(function(categories){
				if(categories < 1){
					model.GrievanceCategory.bulkCreate([{
						GrievanceCategory: "Repair"
					},{
						GrievanceCategory: "Tenant Related"
					}]).then(function(created){
						console.log("sync complete");
					});
				}
				else{
					console.log("sync complete");
				}
			}).catch(function(err){
				console.log(err);
			});
		}).catch(function(err){
			console.log(err);
		});
	})(module.exports);
}).catch(function(err){
	console.log(err);
});