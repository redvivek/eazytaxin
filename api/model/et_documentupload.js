/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('et_documentupload', {
    documentId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    DocumentCategory: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    DocumentName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    DocumentPath: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    DocumentObject: {
      type: "BLOB",
      allowNull: true
    },
    DocUploadDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    DocModifiedDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'et_documentupload'
  });
};
