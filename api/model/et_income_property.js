/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('et_income_property', {
    IncomeHouseDetailsId: {
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
    PropertyType: {
      type: DataTypes.ENUM('Houseprop','Rentalprop'),
      allowNull: true
    },
    AmountReceived: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    HousetaxPaid: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    TenantName: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    TanantPanno: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    HouseloanFlag: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    InterestAmount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    DocumentUploadFlag: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
    },
    UnrealizedRentAmount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    CoownerFlag: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    OwnershipShare: {
      type: DataTypes.INTEGER(3),
      allowNull: true
    },
    CompletionStatus: {
      type: DataTypes.ENUM('Yes','No'),
      allowNull: true,
      defaultValue: 'No'
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
    tableName: 'et_income_property'
  });
};
