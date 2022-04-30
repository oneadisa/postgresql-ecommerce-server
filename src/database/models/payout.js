module.exports = (sequelize, DataTypes) => {
  const Payout = sequelize.define('Payout', {
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    campaignId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    businessName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    campaignName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ownerLogo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    investorBrief: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstPaymentDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    lastPaymentDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    recipientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  Payout.associate = (models) => {
    Payout.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
      },
    });
    Payout.belongsTo(models.Campaign, {
      foreignKey: {
        name: 'campaignId',
      },
    });
  };

  return Payout;
};

