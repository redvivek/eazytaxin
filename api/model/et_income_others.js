/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('et_income_others', {
    IncomeSourceOthersId: {
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
    DocumentUploadFlag: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '0'
    },
    SavingsInterestAmount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    FDInterestAmount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    GiftsIncome: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    DividendEarnedAmount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    ExemptInterestIncome: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    OtherExemptIncome: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    GrossAgriIncome: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    AgriExpenditure: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    AgriLoss: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    PFWithdrawalIncome: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    PFWithdrawalTaxrate: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    CompletionStatus: {
      type: DataTypes.ENUM('Yes','No'),
      allowNull: true,
      defaultValue: 'No'
    }
  }, {
    tableName: 'et_income_others'
  });
};
