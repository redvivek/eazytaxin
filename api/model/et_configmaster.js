module.exports = function(sequelize, DataTypes) {
    return sequelize.define('et_configmaster', {
        ConfigId: {
            type: DataTypes.INTEGER(3),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        KeyName: {
            type: DataTypes.STRING(10),
            allowNull: false,
            unique: true
        },
        KeyValue: {
            type: DataTypes.STRING(200),
            allowNull: false,
            unique: true
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
        MerchantName: {
            type: DataTypes.STRING(100),
            allowNull: true,
        }
    }, {
      tableName: 'et_configmaster'
    });
  };