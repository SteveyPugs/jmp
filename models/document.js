module.exports = function(sequelize, DataTypes){
	var Document = sequelize.define("Document", {
		DocumentID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Document: {
			type: DataTypes.BLOB("long"),
			allowNull: false
		},
		DocumentName: {
			type: DataTypes.STRING,
			allowNull: false
		}
	},{
		paranoid: true
	});
	return Document;
};