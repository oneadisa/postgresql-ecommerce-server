module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      transactionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      currency: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ['NGN', 'USD', 'EUR', 'GBP'],
      },
      paymentStatus: {
        type: Sequelize.STRING,
        values: ['successful', 'pending', 'failed'],
        allowNull: false,
        defaultValue: 'pending',
      },
      // Payment gateway may differ as the application grows
      paymentGateway: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ['flutterwave'],
      },
      balanceBefore: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      balanceAfter: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      userId: {
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
    await queryInterface.dropTable('Transactions');
  },
};


