module.exports = function(sequelize, DataTypes){
	var Property = sequelize.define("Property", {
		PropertyID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		PropertyAddress: {
			type: DataTypes.STRING,
			allowNull: false
		},
		PropertyCity: {
			type: DataTypes.STRING,
			allowNull: false
		},
		PropertyState: {
			type: DataTypes.STRING(2),
			allowNull: false
		},
		PropertyUnitCount: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		PropertyType: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	});
	return Property;
};