module.exports = (sequelize, DataTypes) => {
  const Campaign = sequelize.define('Campaign', {
    campaignName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    natureOfBusiness: {
      type: DataTypes.ENUM,
      values: ['LLC', 'sole proprietorship', 'unregistered'],
      allowNull: false,
    },
    campaignCategory: {
      type: DataTypes.ENUM,
      values: ['community', 'transport', 'education',
        'hospitality', 'technology',
        'food and drink', 'retail', 'travel',
        'health and fitness', 'creative arts',
        'sports', 'entertainment', 'tourism',
        'politics', 'leisure'],
      allowNull: false,
    },
    businessAddressCountry: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    businessAddressCity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    businessAddressOffice: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    investorBrief: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    campaignVideo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },
    pitchDeck: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    idealTargetAudienceAge: {
      type: DataTypes.ENUM,
      values: ['children', 'youths', 'older'],
      allowNull: true,
    },
    idealTargetAudienceHealthIssuesOrDisabilities: {
      type: DataTypes.ENUM,
      values: ['physical disabilities', 'addiction issues',
        'cognitive or learning disabilities'],
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM,
      values: ['male', 'female', 'gender neutral', 'non-binary'],
      allowNull: true,
    },
    fundingType: {
      type: DataTypes.STRING,
      //   values: ['debt', 'equity'],
      allowNull: false,
    },
    categoryFunding: {
      type: DataTypes.STRING,
      //   values: ['tier 1', 'tier 2', 'tier 3',
      // 'tier 4'],
      allowNull: false,
    },
    totalNumberOfCampaignDonors: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    amountBeingRaised: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    amountAlreadyRaised: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    amountRepaid: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    amountToBeRepaid: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    amountToBeRepaidPerPayout: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    pledgedProfitToLenders: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0,
    },
    durationPledgedProfit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    repaymentSchedulePledgedProfit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    endDatePledgedProfit: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endDatePledgedProfitString: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    timePerPayment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    equityOfferingPercentage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    bankCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bankAccountName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bankAccountNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration: {type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0},
    goLiveSchedule: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 0,
    },
    campaignLiveStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    familiarWithCrowdFunding: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    storeOnGaged: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    firstPaymentDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    firstPaymentDateString: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endDateString: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ownerLogo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    business: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  Campaign.associate = (models) => {
    Campaign.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
      },
    });
    Campaign.hasMany(models.Donation, {
      foreignKey: {
        name: 'campaignId',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
    Campaign.hasMany(models.CampaignReview, {
      foreignKey: {
        name: 'campaignId',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  };

  return Campaign;
};


