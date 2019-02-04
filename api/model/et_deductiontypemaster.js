/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('et_deductiontypemaster', {
    DeductionTypeId: {
      type: DataTypes.INTEGER(3),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    DeductionType: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true
    },
    DeductionDesc: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Category: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    Status: {
      type: DataTypes.ENUM('Active','Disabled','Delete'),
      allowNull: false,
      defaultValue: 'Active'
    }
  }, {
    tableName: 'et_deductiontypemaster'
  });
};
