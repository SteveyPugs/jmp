var config = require("./config");
var Sequelize = require("sequelize");
const sequelize = new Sequelize(config.db, config.user, config.pass, {
  host: config.host,
  dialect: "mysql"
});

var models = [{
	name: "User",
	file: "user"
},{
	name: "PropertyType",
	file: "propertytype"
}];

models.forEach(function(model) {
	module.exports[model.name] = sequelize.import("models/" + model.file);
});

sequelize.authenticate().then(function(err){
	if(err) console.log(err);
	(function(model){
		model.User.belongsTo(model.PropertyType); 
		sequelize.sync({
			force: false
		}).then(function(){
			model.PropertyType.count().then(c => {
				if(c < 1){
					return model.PropertyType.bulkCreate([{PropertyType: "Residential"},{PropertyType: "Commercial"}]); 
				}
			});
		}).catch(function(err){
			console.log(err);
		});
	})(module.exports);
}).catch(function(err){
	console.log(err);
});
