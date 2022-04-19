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
      campaignId: {
        type: Sequelize.INTEGER,
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
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      campaignName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ownerLogo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      investorBrief: {
        type: Sequelize.STRING,
        allowNull: false,
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

