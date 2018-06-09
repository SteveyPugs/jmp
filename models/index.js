var config = require("../config");
var Sequelize = require("sequelize");
var sequelize = new Sequelize(config.database.database, config.database.user, config.database.password, {
	host: config.database.host,
	dialect: "mysql",
	logging: false,
	operatorsAliases: true
});

var models = [{
	name: "Landlord",
	file: "landlord"
},{
	name: "Property",
	file: "property"
},{
	name: "Unit",
	file: "unit"
},{
	name: "Tenant",
	file: "tenant"
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
	name: "Admin",
	file: "admin"
},{
	name: "Grievance",
	file: "grievance"
},{
	name: "GrievanceMessage",
	file: "grievance_message"
},{
	name: "Lease",
	file: "lease"
}];

models.forEach(function(model) {
	module.exports[model.name] = sequelize.import(__dirname + '/' + model.file);
});

sequelize.authenticate().then(function(err){
	if(err) console.log(err);
	(function(model){
		model.Property.belongsTo(model.Landlord, {
			foreignKey: {
				name: "LandlordID",
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
		model.Tenant.hasMany(model.UnitTenant, {
			foreignKey: {
				name: "TenantID",
				allowNull: false
			}
		});
		model.UnitTenant.belongsTo(model.Tenant, {
			foreignKey: {
				name: "TenantID",
				allowNull: false
			}
		});
		model.PaymentOption.belongsTo(model.Tenant, {
			foreignKey: {
				name: "TenantID",
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
		model.Tenant.hasMany(model.Payment, {
			foreignKey: {
				name: "TenantID",
				allowNull: false
			}
		});
		model.Payment.belongsTo(model.Tenant, {
			foreignKey: {
				name: "TenantID",
				allowNull: false
			}
		});
		model.Tenant.hasMany(model.Grievance, {
			foreignKey: {
				name: "TenantID",
				allowNull: false
			}
		});
		model.Grievance.belongsTo(model.Tenant, {
			foreignKey: {
				name: "TenantID",
				allowNull: false
			}
		});
		model.Admin.hasMany(model.Grievance, {
			foreignKey: {
				name: "AdminID",
				allowNull: true
			}
		});
		model.Grievance.belongsTo(model.Admin, {
			foreignKey: {
				name: "TenantID",
				allowNull: true
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