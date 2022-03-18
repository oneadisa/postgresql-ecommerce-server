module.exports = (sequelize, DataTypes) => {
  const Campaign = sequelize.define('Campaign', {
    campaignName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    natureOfBusiness: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    campaignCategory: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    business_address_country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    business_address_city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    business_address_office: {
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
    },
    pitchDeck: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ideal_target_audience_age: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ideal_target_audience_health_issues_or_disabilities: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM,
      values: ['Male', 'Female'],
      allowNull: false,
    },
    fundingType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoryFunding: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amountBeingRaised: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    amountAlreadyRaised: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      default: 0,
    },
    amountRepaid: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      default: 0,
    },
    amountToBeRepaid: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      default: 0,
    },
    amountToBeRepaidPerPayout: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      default: 0,
    },
    pledged_profit_to_lenders: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    duration_pledged_profit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    repayment_schedule_pledged_profit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    endDatePledgedProfit: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDatePledgedProfitString: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timePerPayment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    equity_offering_percentage: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    bankCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bank_account_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bank_account_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    go_live_schedule: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    campaignLiveStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: true,
    },
    familiarWithCrowdFunding: {
      type: DataTypes.ENUM,
      values: ['Yes', 'No'],
      allowNull: false,
    },
    storeOnGaged: {
      type: DataTypes.ENUM,
      values: ['Yes', 'No'],
      allowNull: false,
    },
    firstPaymentDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    firstPaymentDateString: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDateString: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalNumberOfCampaignDonors: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 0,
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
  };

  return Campaign;
};

