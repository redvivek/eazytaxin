/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('et_applicationsmain', {
    ApplicationId: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    UserId: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true
    },
    AppRefNo: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    AssesmentYear: {
      type: DataTypes.STRING(15),
      allowNull: false,
      primaryKey: true
    },
    XmlUploadFlag: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    },
    IncomeSalaryFlag: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: 0
    },
    IncomeOthersFlag: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: 0
    },
    IncomeHouseFlag: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: 0
    },
    IncomeRentalFlag: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: 0
    },
    IncomeCapitalGainsFlag: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: 0
    },
    DeductionsFlag: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: 0
    },
    ResidentIndianFlag:{
      type : DataTypes.INTEGER(1),
      allowNull : false,
      defaultValue:0
    },
    NonResidentIndianFlag:{
      type : DataTypes.INTEGER(1),
      allowNull : false,
      defaultValue:0
    },
    OciResidentIndianFlag:{
      type : DataTypes.INTEGER(1),
      allowNull : false,
      defaultValue:0
    },
    PresentIndiaFlag:{
      type : DataTypes.INTEGER(1),
      allowNull : false,
      defaultValue:0
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    ApplicationCompletionDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ApplicationStage: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    ApplicationStatus: {
      type: DataTypes.ENUM('Initiated','Progress','Complete'),
      allowNull: false
    },
    AppPaymentStatus: {
      type: DataTypes.ENUM('NotStarted','Initiated','Progress','Complete'),
      allowNull: false,
      defaultValue: 'NotStarted'
    },
    AppITRUploadStatus: {
      type: DataTypes.ENUM('Yes','No'),
      allowNull: true
    },
    AppITRUploadDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    AppITRUploadByUser: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    }
  }, {
    tableName: 'et_applicationsmain'
  });
};
