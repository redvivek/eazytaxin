/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('et_taxsummary', {
      SummaryId: {
        type: DataTypes.INTEGER(11),
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
      
      GrandTotalIncome: {
        type: DataTypes.FLOAT(),
        allowNull: true
      },
      TotalDeductions: {
        type: DataTypes.FLOAT(),
        allowNull: true
      },
      NetTaxIncome: {
        type: DataTypes.FLOAT(),
        allowNull: true
      },
      TotalTaxLiability: {
        type: DataTypes.FLOAT(),
        allowNull: true
      },
      TaxCredit: {
        type: DataTypes.FLOAT(),
        allowNull: true
      },
      TaxesPaid: {
        type: DataTypes.FLOAT(),
        allowNull: true
      },
      TotalInterestAmount: {
        type: DataTypes.FLOAT(),
        allowNull: true
      },
      TotalBalance: {
        type: DataTypes.FLOAT(),
        allowNull: true
      },
      UserApproval: {
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
      tableName: 'et_taxsummary'
    });
  };
  