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