module.exports = (sequelize, DataTypes) => {
  const Store = sequelize.define('Store', {
    storeName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    storeTagline: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    storeDescription: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    storeLink: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    storeLogo: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue:
            'https://images.unsplash.com/photo-1615799998603-7c6270a45196?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1604&q=80',
      validate: {
        isUrl: true,
      },
    },
    storeBackground: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue:
            'https://www.seekpng.com/png/full/332-3320905_shadow-768x364-light-gray-gradient-background.png',
      validate: {
        isUrl: true,
      },
    },
    deliveryPrice: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    businessId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  Store.associate = (models) => {
    Store.belongsTo(models.Business, {
      foreignKey: {
        name: 'businessId',
      },
    });
    Store.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
      },
    });
    Store.hasMany(models.Product, {
      foreignKey: {
        name: 'storeId',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  };

  return Store;
};

