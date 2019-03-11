/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('et_property_coownerdetails', {
    cownerId: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    IncomeHouseDetailsId: {
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
    PropertyType: {
      type: DataTypes.ENUM('Houseprop','Rentalprop'),
      allowNull: false
    },
    PersonName: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Panno: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Share: {
      type: DataTypes.INTEGER(3),
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
    tableName: 'et_property_coownerdetails'
  });
};
