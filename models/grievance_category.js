module.exports = function(sequelize, DataTypes){
	var GrievanceCategory = sequelize.define("GrievanceCategory", {
		GrievanceCategoryID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		GrievanceCategory: {
			type: DataTypes.STRING,
			allowNull: false
		}
	},{
		paranoid: true
	});
	return GrievanceCategory;
};