module.exports = (sequelize, DataTypes) => {
  const CampaignReview = sequelize.define('CampaignReview', {
    comment: {
      type: DataTypes.STRING,
      allowNull: true,
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
    campaignId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  CampaignReview.associate = (models) => {
    CampaignReview.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
      },
    });
    CampaignReview.belongsTo(models.Campaign, {
      foreignKey: {
        name: 'campaignId',
      },
    });
  };

  return CampaignReview;
};


