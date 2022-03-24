module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
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
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue:
        'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
      validate: {
        isUrl: true,
      },
    },
    role: {type: DataTypes.STRING,
      allowNull: false,
      defaultValue:
        'user'},
    meansOfID: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    IDpic: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue:
        'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
      validate: {
        isUrl: true,
      },
    },
    bankCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bankAccountName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bankAccountNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    walletBalance: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
  });
  User.associate = (models) => {
    User.hasOne(models.Business, {
      foreignKey: {
        name: 'userId',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
    User.hasOne(models.Store, {
      foreignKey: {
        name: 'userId',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
    // User.hasMany(models.Campaign, {
    // foreignKey: {
    // name: 'userId',
    // },
    // onDelete: 'SET NULL',
    // onUpdate: 'CASCADE',
    // });
    // User.hasMany(models.Product, {
    // foreignKey: {
    // name: 'userId',
    // },
    // onDelete: 'SET NULL',
    // onUpdate: 'CASCADE',
    // });
    // User.hasMany(models.Order, {
    // foreignKey: {
    // name: 'userId',
    // },
    // onDelete: 'SET NULL',
    // onUpdate: 'CASCADE',
    // });
    // User.hasMany(models.Images, {
    // foreignKey: {
    // name: 'userId',
    // },
    // onDelete: 'SET NULL',
    // onUpdate: 'CASCADE',
    // });
  };

  return User;
};
