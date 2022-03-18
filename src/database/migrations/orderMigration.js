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
      phoneNo: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      // paymentInfo: {
      // id: {
      // type: Sequelize.STRING,
      // allowNull: false,
      // },
      // status: {
      // type: Sequelize.STRING,
      // allowNull: false,
      // },
      // },
      paidAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      itemsPrice: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0,
      },
      taxPrice: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0,
      },
      shippingPrice: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0,
      },
      totalPrice: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0,
      },
      orderStatus: {
        type: Sequelize.STRING,
        allowNull: false,
        default: 'Processing',
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      productID: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
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

