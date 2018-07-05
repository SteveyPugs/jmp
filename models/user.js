module.exports = function(sequelize, DataTypes){
	var User = sequelize.define("User", {
		UserID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		UserEmail: {
			type: DataTypes.STRING,
			allowNull: false
		},
		UserPassword: {
			type: DataTypes.STRING,
			allowNull: false
		},
		UserFullName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		UserLevel: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	},{
		paranoid: true
	});
	return User;
};