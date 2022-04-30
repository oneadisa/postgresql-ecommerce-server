module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    transactionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    currency: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['NGN', 'USD', 'EUR', 'GBP'],
    },
    paymentStatus: {
      type: DataTypes.STRING,
      values: ['successful', 'pending', 'failed'],
      allowNull: false,
      defaultValue: 'pending',
    },
    // Payment gateway may differ as the application grows
    paymentGateway: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['flutterwave'],
    },
    balanceBefore: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    balanceAfter: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

  });
  Transaction.associate = (models) => {
    Transaction.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
      },
    });
  };

  return Transaction;
};


