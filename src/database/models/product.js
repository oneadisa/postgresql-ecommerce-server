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
    shippingCost: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    numOfReviews: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 0,
    },
    ratings: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 0,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    storeId: {
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
    Product.hasMany(models.Order, {
      foreignKey: {
        name: 'productId',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
    Product.hasMany(models.Images, {
      foreignKey: {
        name: 'productId',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  };

  return Product;
};

