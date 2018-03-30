var config = require("../config");
var Sequelize = require("sequelize");
var sequelize = new Sequelize(config.database.database, config.database.user, config.database.password, {
	host: config.database.host,
	dialect: "mysql",
	logging: false,
	operatorsAliases: false
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
		sequelize.sync({
			force: false
		}).then(function(){
			console.log("sync complete");
		}).catch(function(err){
			console.log(err);
		});
	})(module.exports);
}).catch(function(err){
	console.log(err);
});