module.exports = function(sequelize, DataTypes){
	var UnitTenant = sequelize.define("UnitTenant", {
		UnitTenantID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		}
	},{
		paranoid: true
	});
	return UnitTenant;
};