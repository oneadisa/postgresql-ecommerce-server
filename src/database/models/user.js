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
      values: ['male', 'female', 'gender neutral'],
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
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
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue:
        'user',
    },
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
    twitter: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue:
        'https://twitter.com',
      validate: {
        isUrl: true,
      },
    },
    facebook: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue:
        'https://facebook.com',
      validate: {
        isUrl: true,
      },
    },
    whatsapp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    walletBalance: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpire: {
      allowNull: true,
      type: DataTypes.DATE,
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
    User.hasOne(models.Wallet, {
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
    User.hasMany(models.Campaign, {
      foreignKey: {
        name: 'userId',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
    User.hasMany(models.Product, {
      foreignKey: {
        name: 'userId',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
    User.hasMany(models.ProductReview, {
      foreignKey: {
        name: 'userId',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
    User.hasMany(models.CampaignReview, {
      foreignKey: {
        name: 'userId',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
    User.hasMany(models.Donation, {
      foreignKey: {
        name: 'userId',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
    User.hasMany(models.Order, {
      foreignKey: {
        name: 'userId',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
    User.hasMany(models.ProductImage, {
      foreignKey: {
        name: 'userId',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
    User.hasMany(models.WalletTransfer, {
      foreignKey: {
        name: 'userId',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
    User.hasMany(models.WalletTransaction, {
      foreignKey: {
        name: 'userId',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
    User.hasMany(models.Transaction, {
      foreignKey: {
        name: 'userId',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
    User.hasMany(models.Payout, {
      foreignKey: {
        name: 'userId',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  };

  return User;
};
