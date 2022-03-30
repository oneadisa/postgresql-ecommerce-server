/* eslint-disable max-len */
import {successResponse, errorResponse,
  extractCampaignData} from '../utils/helpers';
import ApiError from '../utils/apiError';
import {createCampaign, findCampaignBy, findCampaignsBy,
  updateCampaignBy, findStoreBy,
  fetchAllCampaigns, deleteCampaignById, findBusinessBy} from '../services';


/**
         * Creates a new Campaign.
         *
         * @param {Request} req The request from the endpoint.
         * @param {Response} res TheyId response returned by the method.
         * @memberof CampaignController
         * @return {JSON} A JSON response with the created Campaign's
         *  details.
         */
export const addCampaign = async (req, res) => {
  try {
    const {
      campaignName,
      natureOfBusiness,
      campaignCategory,
      businessAddressCountry,
      businessAddressCity,
      businessAddressOffice,
      phoneNumber,
      investorBrief,
      campaignVideo,
      pitchDeck,
      idealTargetAudienceAge,
      idealTargetAudienceHealthIssuesOrDisabilities,
      gender,
      fundingType,
      categoryFunding,
      amountBeingRaised,
      pledgedProfitToLenders,
      durationPledgedProfit,
      repaymentSchedulePledgedProfit,
      equityOfferingPercentage,
      bankCode,
      bankAccountName,
      bankAccountNumber,
      duration,
      goLiveSchedule,
      familiarWithCrowdFunding,
      storeOnGaged,
      userId,
    } = req.body;
    const business = await findBusinessBy({userId});
    const store = await findStoreBy({userId});
    const campaignInfo = {
      campaignName,
      natureOfBusiness,
      campaignCategory,
      businessAddressCountry,
      businessAddressCity,
      businessAddressOffice,
      phoneNumber,
      investorBrief,
      campaignVideo,
      pitchDeck,
      idealTargetAudienceAge,
      idealTargetAudienceHealthIssuesOrDisabilities,
      gender,
      ownerLogo: store.storeLogo,
      fundingType,
      categoryFunding,
      amountBeingRaised: Number(amountBeingRaised),
      amountAlreadyRaised: 0,
      amountRepaid: 0,
      amountToBeRepaid: 0,
      amountToBeRepaidPerPayout: 0,
      pledgedProfitToLenders: Number(pledgedProfitToLenders),
      durationPledgedProfit,
      repaymentSchedulePledgedProfit: Number(repaymentSchedulePledgedProfit),
      endDatePledgedProfit: 0,
      endDatePledgedProfitString: '',
      timePerPayment: 0,
      equityOfferingPercentage: Number(equityOfferingPercentage),
      bankCode,
      bankAccountName,
      bankAccountNumber,
      duration: Number(duration),
      goLiveSchedule: goLiveSchedule,
      familiarWithCrowdFunding,
      storeOnGaged,
      // paymentStartDate,
      endDate: 0,
      firstPaymentDate: 0,
      firstPaymentDateString: '',
      endDateString: '',
      business: business.businessName,
      userId,
    };
    campaignInfo.amountToBeRepaid =
  campaignInfo.amountAlreadyRaised +
  campaignInfo.amountAlreadyRaised * (campaignInfo.pledgedProfitToLenders)/100;
    campaignInfo.amountToBeRePaidPerPayout =
    (campaignInfo.amountToBeRepaid / campaignInfo.durationPledgedProfit) *
    campaignInfo.repaymentSchedulePledgedProfit;
    const numWeeks = campaignInfo.duration;
    const now = new Date().getTime();
    const goLive =
  new Date(campaignInfo.goLiveSchedule).getTime() - new Date().getTime();
    campaignInfo.go_ = Math.abs(now);
    campaignInfo.endDate = goLive + now + numWeeks * 7 * 1000 * 60 * 60 * 24;
    campaignInfo.endDateString = new Date(campaignInfo.endDate).toString();
    // new Date(now + numWeeks * 7 * 1000 * 60 * 60 * 24);
    campaignInfo.endDatePledgedProfit =
  goLive +
  now +
  campaignInfo.duration * (7 * 1000 * 60 * 60 * 24) +
  campaignInfo.durationPledgedProfit * (30 * 1000 * 60 * 60 * 24);
    campaignInfo.endDatePledgedProfitString = new Date(campaignInfo.endDatePledgedProfit).toString();
    campaignInfo.numberOfPaymentsToBeMade =
  campaignInfo.durationPledgedProfit /
  campaignInfo.repaymentSchedulePledgedProfit;
    const repaymentTime = Math.abs(
        campaignInfo.endDatePledgedProfit - campaignInfo.endDate,
    );
    campaignInfo.timePerPayment =
  repaymentTime /
  (campaignInfo.durationPledgedProfit /
    campaignInfo.repaymentSchedulePledgedProfit);
    campaignInfo.firstPaymentDate = campaignInfo.endDate + campaignInfo.timePerPayment;
    campaignInfo.firstPaymentDateString = new Date(campaignInfo.firstPaymentDate).toString();
    const campaign = await createCampaign(campaignInfo);
    successResponse(res, {...campaign}, 201);
  } catch (error) {
    errorResponse(res, {
      code: error.statusCode,
      message: error.message,
    });
  }

  //   try {
  // const {body} = req;
  // const campaign = await createCampaign(body);
  // successResponse(res, {...campaign}, 201);
  //   } catch (error) {
  // errorResponse(res, {
  //   message: error.message,
  // });
  //   }
};

/**
         * Get all campaigns
         *
         * @static
         * @param {Request} req - The request from the browser.
         * @param {Response} res - The response returned by the method.
         * @return { JSON } A JSON response all the created campaigns.
         * @memberof CampaignController
         */
export const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await fetchAllCampaigns();

    res.status(200).json({
      success: true,
      campaigns,
    });
    successResponse(res, {...campaigns}, 201);
  } catch (error) {
    errorResponse(res, {
      code: error.statusCode,
      message: error.message,
    });
  }
};


/**
         * Creates accommodation booking.
         *
         * @param {Request} req - The request from the browser.
         * @param {Response} res - The response returned by the method.
         * @return { JSON } A JSON response with the newly created booking.
         * @memberof CampaignController
         */
export const getCampaignDetails = async (req, res) => {
  try {
    const id = req.params.campaignId;
    const campaign = await findCampaignBy({id});
    const campaignResponse = extractCampaignData(campaign);
    successResponse(res, campaignResponse, 200);
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};

/**
         * Get campaigns that belong to a particular product.
         *
         * @static
         * @param {Request} req - The request from the browser.
         * @param {Response} res - The response returned by the method.
         * @return { JSON } A JSON response with the newly created booking.
         * @memberof CampaignController
         */
// export const getCampaignsProduct = async (req, res) => {
//   try {
// const id = req.params.productId;
// const campaigns = await findCampaignsBy({productId: id});
// const userResponse = extractUserData(user);
// successResponse(res, campaigns, 200);
//   } catch (error) {
// errorResponse(res, {code: error.statusCode, message: error.message});
//   }
// };

/**
         * Updates a campaign profile (admin)
         *

         * @param {Request} req - The request from the endpoint.
         * @param {Response} res - The response returned by the method.
         * @param {Response} next - The response returned by the method.
         * @return { JSON } A JSON response with the new campaign's
         *  profile update.
         * @memberof CampaignController
         */
export const updateCampaignProfile= async (req, res, next) => {
  try {
    const id = req.params.campaignId;
    const campaign = await findCampaignBy({id});

    if (!campaign) {
      throw new ApiError(404, `Campaign with id: ${id} does not exist`);
    } else if (campaign.campaignLiveStatus === 'false') {
      throw new ApiError(404, `This campaign has already ended.`);
    } else {
      const id = req.params.campaignId;
      //   const campaign = await findCampaignBy({id});
      // eslint-disable-next-line max-len
      // const newAmount = amountAlreadyRaised+campaign.amountAlreadyRaised;
      const updatedCampaign = await updateCampaignBy(req.body, {id});
      const campaignResponse = extractCampaignData(updatedCampaign);
      successResponse(res, campaignResponse, 200);
    }
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};


/**
            * Deletes a campaign on a travel request.
            *
            * @param {Request} req - The request from the endpoint.
            * @param {Response} res - The response returned by the method.
            * @return { JSON } A JSON response containing with an empty data
            *  object.
            * @memberof CampaignController
            */
export const deleteCampaignAction = async (req, res) => {
  try {
    const campaignId = req.params.campaignId;
    const rowDeleted = await deleteCampaignById(campaignId);
    if (!rowDeleted) return errorResponse(res, {});
    successResponse(res, {id: campaignId}, 200);
  } catch (err) {
    errorResponse(res, {});
  }
};

/**
           *
           *  Get profile campaign details
           * @static
           * @param {Request} req - The request from the endpoint.
           * @param {Response} res - The response returned by the method.
           * @param {Response} next - The response returned by the method.
           * @memberof Auth
           */
export const getMyCampaignDetails = async (req, res, next) => {
  try {
    const campaigns = await findCampaignsBy({userId: req.user.id});
    if (!campaigns) {
      return errorResponse(res, {code: 401, message:
                  // eslint-disable-next-line max-len
                  'This user does not exist or is logged out. Please login or sign up.'});
    }
    res.status(200).json({
      success: true,
      campaigns,
    });
    successResponse(res, {...campaigns}, 201);
  } catch (error) {
    errorResponse(res, {});
  }
};

/**
           *
           *  Get profile campaign details
           * @static
           * @param {Request} req - The request from the endpoint.
           * @param {Response} res - The response returned by the method.
           * @param {Response} next - The response returned by the method.
           * @memberof Auth
           */
export const getCampaignDetailsUser = async (req, res, next) => {
  try {
    const campaigns = await findCampaignsBy({userId: req.params.userId});
    if (!campaigns) {
      return errorResponse(res, {code: 401, message:
                  // eslint-disable-next-line max-len
                  'This user does not exist or is logged out. Please login or sign up.'});
    }
    res.status(200).json({
      success: true,
      campaigns,
    });
    successResponse(res, {...campaigns}, 201);
  } catch (error) {
    errorResponse(res, {});
  }
};


