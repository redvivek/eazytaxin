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
      allowNull: true
    },
    IncomeOthersFlag: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    IncomeHouseFlag: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    IncomeRentalFlag: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    IncomeCapitalGainsFlag: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    DeductionsFlag: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    ResidentIndianFlag:{
      type : DataTypes.INTEGER(1),
      allowNull: true
    },
    NonResidentIndianFlag:{
      type : DataTypes.INTEGER(1),
      allowNull: true
    },
    OciResidentIndianFlag:{
      type : DataTypes.INTEGER(1),
      allowNull: true
    },
    LngPresentIndiaFlag:{
      type : DataTypes.INTEGER(1),
      allowNull: true
    },
    ShrtPresentIndiaFlag:{
      type : DataTypes.INTEGER(1),
      allowNull: true
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
