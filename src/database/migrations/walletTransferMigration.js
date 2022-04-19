module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('WalletTransfers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      trnxType: {
        type: Sequelize.ENUM,
        values: ['CR', 'DR'],
        allowNull: false,
      },
      purpose: {
        type: Sequelize.ENUM,
        values: ['deposit', 'transfer', 'reversal', 'withdrawal'],
        allowNull: false,
      },
      amount: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0.00,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      reference: {type: Sequelize.STRING,
        allowNull: false},
      balanceBefore: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      balanceAfter: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      summary: {type: Sequelize.STRING, allowNull: false},
      trnxSummary: {type: Sequelize.STRING, allowNull: false},
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
    await queryInterface.dropTable('WalletTransfers');
  },
};


