'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Businesses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      businessName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      natureOfBusiness: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      businessEmail: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      businessAddress: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      businessType: {
        type: Sequelize.ENUM,
        values: ['LLC', 'sole proprietorship', 'unregistered'],
        allowNull: false,
      },
      regNum: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cacCertURL: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'https://www.seekpng.com/png/full/332-3320905_shadow-768x364-light-gray-gradient-background.png',
      },
      formCO7: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'https://www.seekpng.com/png/full/332-3320905_shadow-768x364-light-gray-gradient-background.png',
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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
    await queryInterface.dropTable('Businesses');
  },
};
