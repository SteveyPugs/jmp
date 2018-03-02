module.exports = function(sequelize, DataTypes){
	var PropertyType = sequelize.define("PropertyType", {
		PropertyType: {
			type: DataTypes.STRING,
			allowNull: false
		}
	});
	return PropertyType;
};