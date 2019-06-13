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
      type: DataTypes.FLOAT,
      allowNull: true
    },
    MovCraftItemsAmount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    MovConveninceItemsAmount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    MovFABankAmount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    MovFASharesAmount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    MovFAInsAmount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    MovFALoansGivenAmount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    MovInHandCashAmount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    AssetsAOPFlag: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue:0
    },
    TotalLiability: {
      type: DataTypes.FLOAT,
      allowNull: true
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
