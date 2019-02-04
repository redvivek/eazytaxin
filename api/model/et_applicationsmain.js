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
      type: DataTypes.STRING(10),
      allowNull: false
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
      allowNull: false
    },
    IncomeOthersFlag: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    },
    IncomeHouseFlag: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    },
    IncomeRentalFlag: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    },
    IncomeCapitalGainsFlag: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    },
    DeductionsFlag: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    },
    ApplicationStartDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    ApplicationCompletionDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    ApplicationModifiedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ApplicationStage: {
      type: DataTypes.INTEGER(10),
      allowNull: false
    },
    ApplicationStatus: {
      type: DataTypes.ENUM('Initiated','Progress','Complete'),
      allowNull: false
    },
    AppPaymentStatus: {
      type: DataTypes.ENUM('Initiated','Progress','Complete'),
      allowNull: false
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
