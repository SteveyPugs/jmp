module.exports = function(sequelize, DataTypes){
	var GrievanceMessage = sequelize.define("GrievanceMessage", {
		GrievanceMessageID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		GrievanceMessage: {
			type: DataTypes.STRING,
			allowNull: false
		},
		GrievanceMessageSide: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		}
	},{
		paranoid: true
	});
	return GrievanceMessage;
};