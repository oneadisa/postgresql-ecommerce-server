module.exports = (sequelize, DataTypes) => {
  const ProductReview = sequelize.define('ProductReview', {
    comment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    businessName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  ProductReview.associate = (models) => {
    ProductReview.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
      },
    });
    ProductReview.belongsTo(models.Product, {
      foreignKey: {
        name: 'productId',
      },
    });
  };

  return ProductReview;
};


