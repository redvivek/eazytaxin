/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('et_immovableassetsdetails', {
    ImmovableAssetsDetailsId: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ALDetailsId: {
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
    Description: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    FlatNo: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    PremiseName: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    StreetName: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    AreaLocality: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    State: {
      type: DataTypes.INTEGER(3),
      allowNull: true
    },
    Pincode: {
      type: DataTypes.INTEGER(6),
      allowNull: true
    },
    Amount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    CreatedDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    ModifiedDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'et_immovableassetsdetails'
  });
};
