/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('et_modulemaster', {
    ModuleId: {
      type: DataTypes.INTEGER(3),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ModuleName: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true
    },
    Status: {
      type: DataTypes.ENUM('Active','Disabled','Delete'),
      allowNull: false,
      defaultValue: 'Active'
    }
  }, {
    tableName: 'et_modulemaster'
  });
};
