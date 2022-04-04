module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Donations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      amount: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      businessName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      campaignId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      amountToBeRepaid: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      amountToBeRepaidPerTime: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      amountAlreadyRepaid: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      firstPaymentDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      lastPaymentDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      recipientId: {
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
    await queryInterface.dropTable('Donations');
  },
};

