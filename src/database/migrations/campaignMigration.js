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
        type: Sequelize.STRING,
        allowNull: false,
      },
      campaignCategory: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      business_address_country: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      business_address_city: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      business_address_office: {
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
      },
      pitchDeck: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ideal_target_audience_age: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ideal_target_audience_health_issues_or_disabilities: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      gender: {
        type: Sequelize.ENUM,
        values: ['Male', 'Female'],
        allowNull: false,
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
        default: 0,
      },
      amountBeingRaised: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      amountAlreadyRaised: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        default: 0,
      },
      amountRepaid: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        default: 0,
      },
      amountToBeRepaid: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        default: 0,
      },
      amountToBeRepaidPerPayout: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        default: 0,
      },
      pledged_profit_to_lenders: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      duration_pledged_profit: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      repayment_schedule_pledged_profit: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      endDatePledgedProfit: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      endDatePledgedProfitString: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      timePerPayment: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      equity_offering_percentage: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      bankCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      bank_account_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      bank_account_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      go_live_schedule: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      campaignLiveStatus: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        default: true,
      },
      familiarWithCrowdFunding: {
        type: Sequelize.ENUM,
        values: ['Yes', 'No'],
        allowNull: false,
      },
      storeOnGaged: {
        type: Sequelize.ENUM,
        values: ['Yes', 'No'],
        allowNull: false,
      },
      firstPaymentDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      firstPaymentDateString: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      endDateString: {
        type: Sequelize.STRING,
        allowNull: false,
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

