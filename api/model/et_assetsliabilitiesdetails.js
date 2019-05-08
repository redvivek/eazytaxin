/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('et_assetsliabilitiesdetails', {
    ALDetailsId: {
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
    ImmovableAssetsFlag: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue:0
    },
    MovJwellaryItemsAmount: {
      type: DataTypes.FLOAT(10,2),
      allowNull: true
    },
    MovCraftItemsAmount: {
      type: DataTypes.FLOAT(10,2),
      allowNull: true
    },
    MovConveninceItemsAmount: {
      type: DataTypes.FLOAT(10,2),
      allowNull: true
    },
    MovFABankAmount: {
      type: DataTypes.FLOAT(10,2),
      allowNull: true
    },
    MovFASharesAmount: {
      type: DataTypes.FLOAT(10,2),
      allowNull: true
    },
    MovFAInsAmount: {
      type: DataTypes.FLOAT(10,2),
      allowNull: true
    },
    MovFALoansGivenAmount: {
      type: DataTypes.FLOAT(10,2),
      allowNull: true
    },
    MovInHandCashAmount: {
      type: DataTypes.FLOAT(10,2),
      allowNull: true
    },
    AssetsAOPFlag: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue:0
    },
    TotalLiability: {
      type: DataTypes.FLOAT(10,2),
      allowNull: false
    },
    ForeignAssesDocUploadFlag: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue:0
    },
    CompletionStatus: {
      type: DataTypes.ENUM('Yes','No'),
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'et_assetsliabilitiesdetails'
  });
};
