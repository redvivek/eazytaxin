/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('et_documentmaster', {
    DocId: {
      type: DataTypes.INTEGER(2),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    DocName: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    DocCategory: {
      type: DataTypes.STRING(25),
      allowNull: false,
      unique: true
    },
    DocDesc: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Status: {
      type: DataTypes.ENUM('Active','Disabled','Delete'),
      allowNull: false,
      defaultValue: 'Active'
    }
  }, {
    tableName: 'et_documentmaster'
  });
};
