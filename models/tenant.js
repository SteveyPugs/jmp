module.exports = function(sequelize, DataTypes){
	var Tenant = sequelize.define("Tenant", {
		TenantID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		TenantOptOut: {
			type: DataTypes.BOOLEAN,
			allowNull: true
		},
		TenantEmail: {
			type: DataTypes.STRING,
			allowNull: true
		},
		TenantPassword: {
			type: DataTypes.STRING,
			allowNull: true
		},
		TenantFullName: {
			type: DataTypes.STRING,
			allowNull: false
		}
	},{
		paranoid: true
	});
	return Tenant;
};