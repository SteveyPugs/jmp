module.exports = function(sequelize, DataTypes){
	var Landlord = sequelize.define("Landlord", {
		LandlordID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		LandlordEmail: {
			type: DataTypes.STRING,
			allowNull: false
		},
		LandlordPassword: {
			type: DataTypes.STRING,
			allowNull: false
		},
		LandlordFullName: {
			type: DataTypes.STRING,
			allowNull: false
		}
	});
	return Landlord;
};