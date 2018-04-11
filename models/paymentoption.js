module.exports = function(sequelize, DataTypes){
	var PaymentOption = sequelize.define("PaymentOption", {
		PaymentOptionID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		PaymentTypeID: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		PaymentCCNumber: {
			type: DataTypes.STRING,
			allowNull: true
		},
		PaymentCCExpiration: {
			type: DataTypes.STRING,
			allowNull: true
		},
		PaymentCCVerification: {
			type: DataTypes.STRING,
			allowNull: true
		},
		PaymentCheckRouting: {
			type: DataTypes.STRING,
			allowNull: true
		},
		PaymentCheckAccount: {
			type: DataTypes.STRING,
			allowNull: true
		}
	},{
		paranoid: true
	});
	return PaymentOption;
};