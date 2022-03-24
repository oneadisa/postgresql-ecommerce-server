module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      productTitle: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      shortDescription: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      productDetails: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      discountedPrice: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      price: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      productUnitCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      deliveryPrice: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      numberOfReviews: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      ratings: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      storeId: {
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
    await queryInterface.dropTable('Products');
  },
};


