module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Stores', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      storeName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      storeTagline: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      storeDescription: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      storeLink: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      category: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      storeLogo: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue:
              'https://images.unsplash.com/photo-1615799998603-7c6270a45196?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1604&q=80',
        validate: {
          isUrl: true,
        },
      },
      storeBackground: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue:
              'https://www.seekpng.com/png/full/332-3320905_shadow-768x364-light-gray-gradient-background.png',
        validate: {
          isUrl: true,
        },
      },
      businessId: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('Stores');
  },
};


