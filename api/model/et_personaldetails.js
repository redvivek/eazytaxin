/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('et_personaldetails', {
    PersonalDetailsId: {
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
    Firstname: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    Middlename: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    Lastname: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    EmailId: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Fathername: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    MobileNo: {
      type: DataTypes.INTEGER(12),
      allowNull: false
    },
    AltMobileNo: {
      type: DataTypes.INTEGER(12),
      allowNull: true
    },
    landlineNo: {
      type: DataTypes.INTEGER(12),
      allowNull: true
    },
    DateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    Gender: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    EmployerName: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    EmployerType: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    PanNumber: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    AadharNumber: {
      type: DataTypes.INTEGER(12),
      allowNull: true
    },
    PassportNumber: {
      type: DataTypes.STRING(8),
      allowNull: true
    },
    CreatedDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    ModifiedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    CompletionStatus: {
      type: DataTypes.ENUM('Yes','No'),
      allowNull: false,
      defaultValue: 'No'
    }
  }, {
    tableName: 'et_personaldetails'
  });
};
