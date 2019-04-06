/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('et_challandetails', {
    ChallanDetailsId: {
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
    doc26AS_UploadFlag: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0'
    },
    BSR_Code: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    PaymentDate: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    ChallanNo: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    TaxPaid: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    taxDeductorName: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    taxDeductorTan: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    taxReceiptNo: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    taxPaidYear: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    taxPaidForAmount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    taxPaidAmount: {
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
    tableName: 'et_challandetails'
  });
};
