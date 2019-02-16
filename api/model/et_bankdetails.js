/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('et_bankdetails', {
    BankDetailsId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ApplicationId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    UserId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    AccountPriority: {
      type: DataTypes.ENUM('Primary','Others'),
      allowNull: false
    },
    AccountNumber: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    AccountType: {
      type: DataTypes.ENUM('Savings','Current'),
      allowNull: false,
      defaultValue: 'Savings'
    },
    BankName: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    IFSCCode: {
      type: DataTypes.STRING(12),
      allowNull: false
    },
    BankBranch: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    MICRCode: {
      type: DataTypes.STRING(12),
      allowNull: true
    },
    CompletionStatus: {
      type: DataTypes.ENUM('Yes','No'),
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    tableName: 'et_bankdetails'
  });
};
