/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('et_emailmaster', {
    EmailId: {
      type: DataTypes.INTEGER(2),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    EmailCatCode: {
      type: DataTypes.STRING(3),
      allowNull: false,
      unique: true
    },
    EmailCategory: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    SubjectTemplate: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    BodyTemplate: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    FromName: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    FromEmail: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Status: {
      type: DataTypes.ENUM('Active','Disabled','Delete'),
      allowNull: false,
      defaultValue: 'Active'
    }
  }, {
    tableName: 'et_emailmaster'
  });
};
