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
      type: DataTypes.STRING(75),
      allowNull: false
    },
    EmailId: {
      type: DataTypes.STRING(125),
      allowNull: false
    },
    Fathername: {
      type: DataTypes.STRING(125),
      allowNull: true
    },
    MobileNo: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    AltMobileNo: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    landlineNo: {
      type: DataTypes.STRING(12),
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
      allowNull: true
    },
    EmployerType: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    PanNumber: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    AadharNumber: {
      type: DataTypes.STRING(28),
      allowNull: false
    },
    PassportNumber: {
      type: DataTypes.STRING(8),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
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
