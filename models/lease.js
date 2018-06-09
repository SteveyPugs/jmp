module.exports = function(sequelize, DataTypes){
	var Lease = sequelize.define("Lease", {
		LeaseID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		LeaseTemplate: {
			type: DataTypes.TEXT,
			allowNull: false
		}
	},{
		paranoid: true
	});
	return Lease;
};