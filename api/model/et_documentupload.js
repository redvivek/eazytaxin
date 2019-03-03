/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('et_documentupload', {
    documentId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    UserId: {
      type: DataTypes.INTEGER(10),
      allowNull: false
    },
    ApplicationId: {
      type: DataTypes.INTEGER(10),
      allowNull: false
    },
    DocumentCategory: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    DocumentName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    FilePassword:{
      type: DataTypes.STRING(100),
      allowNull: true
    },
    DocumentPath: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    DocumentObject: {
      type: "BLOB",
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'et_documentupload'
  });
};
