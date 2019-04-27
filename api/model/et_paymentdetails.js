/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('et_paymentdetails', {
    PaymentDetailsId: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ApplicationId: {
      type: DataTypes.INTEGER(10),
      allowNull: false
    },
    UserId: {
      type: DataTypes.INTEGER(10),
      allowNull: false
    },
    Amount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    TransactionId: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    TransactionStartTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    TransactionEndTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    TransactionStatus: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    TransactionMesage: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    tableName: 'et_paymentdetails'
  });
};
