/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('et_income_dependentincome', {
    DepIncomeId: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    IncomeSourceOthersId: {
      type: DataTypes.INTEGER(10),
      allowNull: false
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
    PersonName: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Relationship: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    NatureOfIncome: {
      type: DataTypes.STRING(10),
      allowNull: true
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
    tableName: 'et_income_dependentincome'
  });
};
