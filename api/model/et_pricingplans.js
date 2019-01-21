/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('et_pricingplans', {
    PlanId: {
      type: DataTypes.INTEGER(2),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    PlanName: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    PlanDesc: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    PlanAmount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    PlanValidity: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    Status: {
      type: DataTypes.ENUM('Active','Disabled','Delete'),
      allowNull: false,
      defaultValue: 'Active'
    }
  }, {
    tableName: 'et_pricingplans'
  });
};
