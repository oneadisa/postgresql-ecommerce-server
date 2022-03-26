module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pinCode: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      phoneNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      productName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      paymentInfoId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      paymentInfoStatus: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      paidAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      itemsPrice: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      taxPrice: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      deliveryPrice: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      totalPrice: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      orderStatus: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Processing',
      },
      deliveredAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      firstName: {type: Sequelize.STRING,
        allowNull: true},
      lastName: {type: Sequelize.STRING,
        allowNull: true},
      businessName: {type: Sequelize.STRING,
        allowNull: true},
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      owner: {type: Sequelize.INTEGER,
        allowNull: true},
      owner: {type: Sequelize.STRING,
        allowNull: true},
      store: {type: Sequelize.STRING,
        allowNull: true},
      business: {type: Sequelize.STRING,
        allowNull: true},
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orders');
  },
};

