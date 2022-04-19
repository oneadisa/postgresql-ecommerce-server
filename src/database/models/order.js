module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pinCode: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentInfoId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentInfoStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    itemsPrice: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    taxPrice: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    deliveryPrice: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    totalPrice: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    orderStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Processing',
    },
    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    businessName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    owner: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    store: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    business: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  Order.associate = (models) => {
    Order.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
      },
    });
    Order.belongsTo(models.Product, {
      foreignKey: {
        name: 'productId',
      },
    });
  };

  return Order;
};


