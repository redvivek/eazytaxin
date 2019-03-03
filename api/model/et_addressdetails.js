/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('et_addressdetails', {
    AdressDetailsId: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ApplicationId: {
      type: DataTypes.INTEGER(10),
      allowNull: false
    },
    UserId: {
      type: DataTypes.INTEGER(10),
      allowNull: false
    },
    IncomeHouseDetailsId: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    AddressType: {
      type: DataTypes.ENUM('Residence','Permanent','Houseprop','Rentalprop'),
      allowNull: false
    },
    Flatno_Blockno: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    Building_Village_Premises: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Road_Street_PO: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Area_Locality: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    City_Town_District: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    State: {
      type: DataTypes.INTEGER(3),
      allowNull: false
    },
    Country: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    Pincode: {
      type: DataTypes.INTEGER(6),
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    CompletionStatus: {
      type: DataTypes.ENUM('Yes','No'),
      allowNull: false
    }
  }, {
    tableName: 'et_addressdetails'
  });
};
