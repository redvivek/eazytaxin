/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('et_income_capitalgains', {
    CapitalgainID: {
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
    SaleType: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    SalesProceedAmt: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    SalesDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    SalesTaxPaid: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    CostBasis: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    PurchaseDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    CompletionStatus: {
      type: DataTypes.ENUM('Yes','No'),
      allowNull: false,
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
    },
    DocUploadFlag: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
    }
  }, {
    tableName: 'et_income_capitalgains'
  });
};
