/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('et_income_salary', {
    IncomeSourceSalId: {
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
    Form16UploadFlag: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '0'
    },
    SalaryPaidAmount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    EmployerName: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    EmployerCategory: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    EmployerTAN: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    TotalTaxDeducted: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    CompletionStatus: {
      type: DataTypes.ENUM('Yes','No'),
      allowNull: true,
      defaultValue: 'No'
    }
  }, {
    tableName: 'et_income_salary'
  });
};