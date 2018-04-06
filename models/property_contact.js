module.exports = function(sequelize, DataTypes){
	var PropertyContact = sequelize.define("PropertyContact", {
		PropertyContactID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		PropertyContactName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		PropertyContactTelephone: {
			type: DataTypes.STRING,
			allowNull: false
		}
	},{
		paranoid: true
	});
	return PropertyContact;
};