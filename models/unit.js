module.exports = function(sequelize, DataTypes){
	var Unit = sequelize.define("Unit", {
		UnitID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		UnitTag: {
			type: DataTypes.STRING,
			allowNull: false
		},
		UnitVacant: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true
		},
		UnitRent: {
			type: DataTypes.FLOAT,
			allowNull: true
		}
	},{
		paranoid: true
	});
	return Unit;
};