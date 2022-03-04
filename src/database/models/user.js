module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
      'User',
      {
        firstName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        lastName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        accountType: {
          type: DataTypes.ENUM,
          values: ['individual', 'business'],
          allowNull: false,
        },
        gender: {
          type: DataTypes.ENUM,
          values: ['male', 'female'],
          allowNull: true,
        },
        phoneNumber: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
  );

  return User;
};

