module.exports = function(sequelize, DataTypes){
	var Payment = sequelize.define("Payment", {
		PaymentID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		PaymentConfirmationCode: {
			type: DataTypes.STRING
		}
	},{
		paranoid: true
	});
	return Payment;
};