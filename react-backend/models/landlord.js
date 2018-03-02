module.exports = function(sequelize, DataTypes){
	var LandLord = sequelize.define("LandLord", {
		FullName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		Address: {
			type: DataTypes.STRING,
			allowNull: false
		},
		City: {
			type: DataTypes.STRING,
			allowNull: false
		},
		State: {
			type: DataTypes.STRING,
			allowNull: false
		},
		NumberOfUnits: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		Email:{
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		Password:{
			type: DataTypes.STRING,
			allowNull: false
		}
	});
	return LandLord;
};