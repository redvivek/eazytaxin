/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const Userinfo =  sequelize.define('et_userinfo', {
    UserId: {
      type: DataTypes.INTEGER(8),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    RoleId: {
      type: DataTypes.INTEGER(2),
      allowNull: false
    },
    Username: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    Password: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Hashkey: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    PanNumber: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    EmailId: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Status: {
      type: DataTypes.ENUM('Active','Disabled','Delete'),
      allowNull: false,
      defaultValue: 'Active'
    },
    LastLoginTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    InvalidLoginCounts: {
      type: DataTypes.INTEGER(2),
      allowNull: false,
      defaultValue: '0'
    },
    CreatedDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    ModifiedDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    SelectedPaymentPlan: {
      type: DataTypes.INTEGER(3),
      allowNull: true
    },
    PlanStartDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    PlanExpiryDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    LastSelectedPlan: {
      type: DataTypes.INTEGER(3),
      allowNull: true
    }
  }, 
  {
    tableName: 'et_userinfo'
  });

  return Userinfo;
};
