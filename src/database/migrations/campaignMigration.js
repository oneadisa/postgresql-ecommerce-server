module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Campaigns', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      campaignName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      natureOfBusiness: {
        type: Sequelize.ENUM,
        values: ['LLC', 'sole proprietorship', 'unregistered'],
        allowNull: false,
      },
      campaignCategory: {
        type: Sequelize.ENUM,
        values: ['community', 'transport', 'education',
          'hospitality', 'technology',
          'food and drink', 'retail', 'travel',
          'health and fitness', 'creative arts',
          'sports', 'entertainment', 'tourism',
          'politics', 'leisure'],
        allowNull: false,
      },
      businessAddressCountry: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      businessAddressCity: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      businessAddressOffice: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      investorBrief: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      campaignVideo: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isUrl: true,
        },
      },
      pitchDeck: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      idealTargetAudienceAge: {
        type: Sequelize.ENUM,
        values: ['children', 'youths', 'older'],
        allowNull: true,
      },
      idealTargetAudienceHealthIssuesOrDisabilities: {
        type: Sequelize.ENUM,
        values: ['physical disabilities', 'addiction issues',
          'cognitive or learning disabilities'],
        allowNull: true,
      },
      gender: {
        type: Sequelize.ENUM,
        values: ['male', 'female', 'gender neutral', 'non-binary'],
        allowNull: true,
      },
      fundingType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      categoryFunding: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      totalNumberOfCampaignDonors: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      amountBeingRaised: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      amountAlreadyRaised: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      amountRepaid: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      amountToBeRepaid: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      amountToBeRepaidPerPayout: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      pledgedProfitToLenders: {
        type: Sequelize.DOUBLE,
        allowNull: true,
        defaultValue: 0,
      },
      durationPledgedProfit: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      repaymentSchedulePledgedProfit: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      endDatePledgedProfit: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      endDatePledgedProfitString: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      timePerPayment: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      equityOfferingPercentage: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      bankCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      bankAccountName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      bankAccountNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      duration: {type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0},
      goLiveSchedule: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 0,
      },
      campaignLiveStatus: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      familiarWithCrowdFunding: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      storeOnGaged: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      firstPaymentDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      firstPaymentDateString: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      endDateString: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ownerLogo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      twitter: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue:
          'https://twitter.com',
        validate: {
          isUrl: true,
        },
      },
      facebook: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue:
          'https://facebook.com',
        validate: {
          isUrl: true,
        },
      },
      whatsapp: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      business: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Campaigns');
  },
};

