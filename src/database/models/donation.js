module.exports = (sequelize, DataTypes) => {
  const Donation = sequelize.define('Donation', {
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
    amountToBeRepaid: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    amountToBeRepaidPerTime: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    amountAlreadyRepaid: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    firstPaymentDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    lastPaymentDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
  Donation.associate = (models) => {
    Donation.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
      },
    });
    Donation.belongsTo(models.Campaign, {
      foreignKey: {
        name: 'campaignId',
      },
    });
  };

  return Donation;
};

