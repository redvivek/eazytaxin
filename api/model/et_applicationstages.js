/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('et_applicationstages', {
    StageId: {
      type: DataTypes.INTEGER(2),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    StageName: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true
    },
    StageParentId: {
      type: DataTypes.INTEGER(2),
      allowNull: false
    },
    Description: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Status: {
      type: DataTypes.ENUM('Active','Disabled','Delete'),
      allowNull: false
    }
  }, {
    tableName: 'et_applicationstages'
  });
};
