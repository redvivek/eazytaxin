/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('et_incometaxpaiddetails', {
      IncomeTaxPaidId: {
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
      IncomTaxDeductorName: {
        type: DataTypes.STRING(150),
        allowNull: true
      },
      IncomeTaxDeductorTan: {
        type: DataTypes.STRING(10),
        allowNull: true
      },
      IncomeChargeUSal: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      IncomeTotalTaxDeducted: {
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
      tableName: 'et_incometaxpaiddetails'
    });
  };
  