module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('WalletTransactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      amount: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      isInflow: {
        type: Sequelize.BOOLEAN,
      },
      paymentMethod: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'flutterwave',
      },
      balanceBefore: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      balanceAfter: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false,
        values: ['NGN', 'USD', 'EUR', 'GBP'],
      },
      status: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ['successful', 'pending', 'failed'],
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
    await queryInterface.dropTable('WalletTransactions');
  },
};


