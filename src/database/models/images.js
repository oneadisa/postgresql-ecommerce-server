module.exports = (sequelize, DataTypes) => {
  const Images = sequelize.define('Images', {
    public_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });
  Images.associate = (models) => {
    Images.belongsTo(models.Product, {
      foreignKey: {
        name: 'productId',
      },
    });
    Images.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
      },
    });
  };

  return Images;
};

