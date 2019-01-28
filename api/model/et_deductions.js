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
      type: DataTypes.ENUM('Main','Others'),
      allowNull: false
    },
    DeductionCategory: {
      type: DataTypes.INTEGER(3),
      allowNull: false
    },
    DeductionSubCategory: {
      type: DataTypes.INTEGER(3),
      allowNull: false
    },
    DeductionAmount: {
      type: DataTypes.FLOAT,
      allowNull: false
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
    Parents_SC_PolicyFlag: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0'
    },
    NoHRA_TotalMonths: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    SpecificDisease_PersonAge: {
      type: DataTypes.ENUM('Above60','Below60'),
      allowNull: true
    },
    CompletionStatus: {
      type: DataTypes.ENUM('Yes','No'),
      allowNull: true,
      defaultValue: 'No'
    }
  }, {
    tableName: 'et_deductions'
  });
};
