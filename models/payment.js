module.exports = function(sequelize, DataTypes){
	var Payment = sequelize.define("Payment", {
		PaymentID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		PaymentAmount: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		PaymentConfirmationCode: {
			type: DataTypes.UUID,
			allowNull: false,
			defaultValue: DataTypes.UUIDV4
		}
	},{
		paranoid: true
	});
	return Payment;
};