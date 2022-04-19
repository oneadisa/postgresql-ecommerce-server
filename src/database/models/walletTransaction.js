module.exports = (sequelize, DataTypes) => {
  const WalletTransaction = sequelize.define('WalletTransaction', {
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isInflow: {
      type: DataTypes.BOOLEAN,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'flutterwave',
    },
    balanceBefore: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    balanceAfter: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      values: ['NGN', 'USD', 'EUR', 'GBP'],
    },
    status: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['successful', 'pending', 'failed'],
    },

  });
  WalletTransaction.associate = (models) => {
    WalletTransaction.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
      },
    });
  };

  return WalletTransaction;
};


