module.exports = function(sequelize, DataTypes){
	var Admin = sequelize.define("Admin", {
		AdminID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		AdminEmail: {
			type: DataTypes.STRING,
			allowNull: false
		}
	},{
		paranoid: true
	});
	return Admin;
};