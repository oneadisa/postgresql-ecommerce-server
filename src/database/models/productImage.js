module.exports = (sequelize, DataTypes) => {
  const ProductImage = sequelize.define('ProductImage', {
    publicId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
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
  ProductImage.associate = (models) => {
    ProductImage.belongsTo(models.Product, {
      foreignKey: {
        name: 'productId',
      },
    });
    ProductImage.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
      },
    });
  };

  return ProductImage;
};

