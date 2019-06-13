/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('et_deductionsdonee', {
        DoneeId: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      DeductionId: {
        type: DataTypes.INTEGER(10),
        allowNull: false
      },
      ApplicationId: {
        type: DataTypes.INTEGER(10),
        allowNull: false
      },
      UserId: {
        type: DataTypes.INTEGER(10),
        allowNull: false
      },
      DoneeName: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      DoneePan: {
        type: DataTypes.STRING(10),
        allowNull: true
      },
      DonationAmount:{
          type: DataTypes.FLOAT,
        allowNull: true
      },
      DoneeDeductionLimit: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      DoneeQualPer: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      DoneeAddress: {
        type: DataTypes.STRING(300),
        allowNull: true
      },
      DoneeCity: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      DoneeState: {
        type: DataTypes.INTEGER(3),
        allowNull: true
      },
      DoneeCountry: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      DonePincode: {
        type: DataTypes.INTEGER(8),
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
      },
    }, {
      tableName: 'et_deductionsdonee'
    });
  };
  