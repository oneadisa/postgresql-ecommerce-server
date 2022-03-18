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
    phoneNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // paymentInfo: {
    // id: {
    // type: DataTypes.STRING,
    // allowNull: false,
    // },
    // status: {
    // type: DataTypes.STRING,
    // allowNull: false,
    // },
    // },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    itemsPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 0,
    },
    taxPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 0,
    },
    shippingPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 0,
    },
    totalPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 0,
    },
    orderStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      default: 'Processing',
    },
    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productID: {
      type: DataTypes.INTEGER,
      allowNull: false,
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

