module.exports = (sequelize, DataTypes) => {
  const WalletTransfer = sequelize.define('WalletTransfer', {
    trnxType: {
      type: DataTypes.ENUM,
      values: ['CR', 'DR'],
      allowNull: false,
    },
    purpose: {
      type: DataTypes.ENUM,
      values: ['deposit', 'transfer', 'reversal', 'withdrawal'],
      allowNull: false,
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0.00,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reference: {type: DataTypes.STRING,
      allowNull: false},
    balanceBefore: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    balanceAfter: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    summary: {type: DataTypes.STRING, allowNull: false},
    trnxSummary: {type: DataTypes.STRING, allowNull: false},

  });
  WalletTransfer.associate = (models) => {
    WalletTransfer.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
      },
    });
  };

  return WalletTransfer;
};


