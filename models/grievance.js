module.exports = function(sequelize, DataTypes){
	var Grievance = sequelize.define("Grievance", {
		GrievanceID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		GrievanceStatus: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		}
	},{
		paranoid: true
	});
	return Grievance;
};