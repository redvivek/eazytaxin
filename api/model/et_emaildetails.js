/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('et_emaildetails', {
    EmailId: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    EmailCatCode: {
      type: DataTypes.STRING(3),
      allowNull: false
    },
    EmailTo: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    EmailSendTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    EmailActualSubject: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    EmailActualBody: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    EmailSendStatus: {
      type: DataTypes.STRING(10),
      allowNull: false
    }
  }, {
    tableName: 'et_emaildetails'
  });
};
