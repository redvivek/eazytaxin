/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('et_rolemaster', {
    RoleId: {
      type: DataTypes.INTEGER(2),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    RoleType: {
      type: DataTypes.STRING(8),
      allowNull: false,
      unique: true
    },
    Status: {
      type: DataTypes.ENUM('Active','Disabled','Delete'),
      allowNull: false,
      defaultValue: 'Active'
    }
  }, {
    tableName: 'et_rolemaster'
  });
};
