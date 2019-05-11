/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('et_deductions', {
    DeductionsId: {
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
    DeductionTypes: {
      type: DataTypes.ENUM('Primary','Others'),
      allowNull: false
    },
    DeductionCategory: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    InvestmentCategory:{
      type: DataTypes.STRING(45),
      allowNull: true
    },
    DeductionAmount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Self_MI_PremiumAmt: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Self_HC_Fees: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Parents_MI_PremiumAmt: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    MedInsRelation: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    DepHealthCheckReln: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ParMedInsReln: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    NoHRA_TotalMonths: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    SpecificDisease_PersonAge: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    DoneeName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    DoneePan: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    DoneeDeductionLimit: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    DoneeQualPer: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    DoneeAddress: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    DoneeCity: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    DoneeState: {
      type: DataTypes.INTEGER(3),
      allowNull: true
    },
    DoneeCountry: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    DonePincode: {
      type: DataTypes.INTEGER(8),
      allowNull: true
    },
    CompletionStatus: {
      type: DataTypes.ENUM('Yes','No'),
      allowNull: true,
      defaultValue: 'No'
    },
    DocUploadFlag:{
      type: DataTypes.ENUM('Yes','No','Done'),
      allowNull: false,
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
  }, {
    tableName: 'et_deductions'
  });
};
