module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    productID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    campaignID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });
  Review.associate = (models) => {
    Review.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
      },
    });
    Review.belongsTo(models.Product, {
      foreignKey: {
        name: 'productId',
      },
    });
    Review.belongsTo(models.Campaign, {
      foreignKey: {
        name: 'campaignId',
      },
    });
  };

  return Review;
};

