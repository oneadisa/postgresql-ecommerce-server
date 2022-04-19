module.exports = (sequelize, DataTypes) => {
  const Wallet = sequelize.define('Wallet', {
    balance: {type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0.00,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  Wallet.associate = (models) => {
    Wallet.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
      },
    });
  };

  return Wallet;
};


