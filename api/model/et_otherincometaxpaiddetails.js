/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('et_otherincometaxpaiddetails', {
      OthIncomeTaxPaidId:{
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
      OthIncome_TaxCreditBelongsTo: {
        type: DataTypes.ENUM('Self','Others'),
        allowNull: true
      },
      OthIncome_TaxDedName: {
        type: DataTypes.STRING(150),
        allowNull: true
      },
      OthIncome_TaxDedTAN: {
        type: DataTypes.STRING(10),
        allowNull: true
      },
      OthIncome_TDSCertiNum: {
        type: DataTypes.STRING(8),
        allowNull: true
      },
      OthIncome_UnclaimedTDSYear: {
        type: DataTypes.STRING(10),
        allowNull: true
      },
      OthIncome_UnclaimedTDSAmount: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      OthIncome_TDSDedFrmReln: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      OthIncome_AmtClaimedCurrYr: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      OthIncome_TaxCreditCFwd: {
        type: DataTypes.FLOAT,
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
      tableName: 'et_otherincometaxpaiddetails'
    });
  };
  