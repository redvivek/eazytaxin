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
      type: DataTypes.INTEGER(1),
      allowNull: true
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
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    Taxperiod: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    RefundInterestIncome: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    OtherInterestIncome: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  }, {
    tableName: 'et_income_others'
  });
};
