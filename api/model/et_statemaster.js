/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('et_statemaster', {
    StateId: {
      type: DataTypes.INTEGER(3),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    StateCode: {
      type: DataTypes.STRING(4),
      allowNull: false,
      unique: true
    },
    StateName: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    CountryCode: {
      type: DataTypes.STRING(4),
      allowNull: false
    },
    Status: {
      type: DataTypes.ENUM('Active','Disabled','Delete'),
      allowNull: false,
      defaultValue: 'Active'
    }
  }, {
    tableName: 'et_statemaster'
  });
};
