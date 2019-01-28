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
    26AS_UploadFlag: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0'
    },
    BSR_Code1: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    PaymentDate1: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    ChallanNo1: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    TaxPaid1: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    BSR_Code2: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    PaymentDate2: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    ChallanNo2: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    TaxPaid2: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    BSR_Code3: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    PaymentDate3: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    ChallanNo3: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    TaxPaid3: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    CompletionStatus: {
      type: DataTypes.ENUM('Yes','No'),
      allowNull: true,
      defaultValue: 'No'
    }
  }, {
    tableName: 'et_challandetails'
  });
};
