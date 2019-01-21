/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('et_contentmgmt', {
    ContentId: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ContentCaption: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    ContentTitle: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    ContentBody: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Status: {
      type: DataTypes.ENUM('Active','Disabled','Delete'),
      allowNull: false,
      defaultValue: 'Active'
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
    CreatedBy: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    }
  }, {
    tableName: 'et_contentmgmt'
  });
};
