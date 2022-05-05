module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      accountType: {
        type: Sequelize.ENUM,
        values: ['individual', 'business'],
        allowNull: false,
      },
      gender: {
        type: Sequelize.ENUM,
        values: ['male', 'female'],
        allowNull: true,
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      avatar: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue:
      'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
        validate: {
          isUrl: true,
        },
      },
      role: {type: Sequelize.STRING,
        allowNull: false,
        defaultValue:
          'user'},
      meansOfID: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      IDpic: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue:
          'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
        validate: {
          isUrl: true,
        },
      },
      bankCode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bankAccountName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bankAccountNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      walletBalance: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      twitter: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue:
     'https://twitter.com',
        validate: {
          isUrl: true,
        },
      },
      facebook: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue:
     'https://facebook.com',
        validate: {
          isUrl: true,
        },
      },
      whatsapp: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      resetPasswordToken: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      resetPasswordExpire: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  },
};
