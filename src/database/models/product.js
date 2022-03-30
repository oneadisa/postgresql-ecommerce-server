module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    productTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shortDescription: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productDetails: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    discountedPrice: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    productUnitCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    deliveryPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    numberOfReviews: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    ratings: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  Product.associate = (models) => {
    Product.belongsTo(models.Store, {
      foreignKey: {
        name: 'storeId',
      },
    });
    Product.belongsTo(models.User, {
      foreignKey: {
        name: 'storeId',
      },
    });
    Product.hasMany(models.ProductReview, {
      foreignKey: {
        name: 'productId',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
    Product.hasMany(models.Order, {
      foreignKey: {
        name: 'productId',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
    Product.hasMany(models.ProductImage, {
      foreignKey: {
        name: 'productId',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  };

  return Product;
};


