/* eslint-disable max-len */
import {successResponse, errorResponse,
  extractDonationData} from '../utils/helpers';
import ApiError from '../utils/apiError';
import {createDonation, findDonationBy, findDonationsBy, findDonationsAndCountBy,
  updateDonationBy, findCampaignBy, findUserBy, findDonationsSum, findDebtSum,
  fetchAllDonations, deleteDonationById, findBusinessBy} from '../services';


/**
           * Creates a new Donation.
           *
           * @param {Request} req The request from the endpoint.
           * @param {Response} res TheyId response returned by the method.
           * @memberof DonationController
           * @return {JSON} A JSON response with the created Donation's
           *  details.
           */
export const addDonation = async (req, res) => {
  try {
    const {
      amount,
      campaignId,
      userId,
    } = req.body;
    const user = await findUserBy({id: userId});
    const business = await findBusinessBy({userId});
    const campaign = await findCampaignBy({id: campaignId});
    const recipient = await findUserBy({id: campaign.userId});

    const repaymentTime = Math.abs(
        campaign.endDatePledgedProfit - campaign.endDate,
    );
    const numberOfRepayments = repaymentTime / campaign.timePerPayment;
    const numberOfTimesPaidAlready =
        repaymentTime / campaign.timePerPayment - numberOfRepayments;
    const amountRepay =
        Number(amount) +
        (campaign.pledgedProfitToLenders / 100) * Number(amount);
    const amountAlreadyRaise =
        (numberOfTimesPaidAlready *
          ((campaign.pledgedProfitToLenders / 100) * Number(amount))) /
        (repaymentTime / campaign.timePerPayment);

    const amountPerTime = amountRepay / (repaymentTime / campaign.timePerPayment);
    if (business) {
      const donationInfo = {
        amount,
        firstName: user.firstName,
        lastName: user.lastName,
        businessName: business.businessName,
        amountToBeRepaid: amountRepay,
        type: campaign.campaignName,
        amountToBeRepaidPerTime: amountPerTime,
        amountAlreadyRepaid: amountAlreadyRaise,
        firstPaymentDate: campaign.firstPaymentDate,
        lastPaymentDate: campaign.endDatePledgedProfit,
        campaignId,
        recipientId: recipient.id,
        userId,
      };
      const donation = await createDonation(donationInfo);
      successResponse(res, {...donation}, 201);
    } else {
      const donationInfo = {
        amount,
        firstName: user.firstName,
        lastName: user.lastName,
        amountToBeRepaid: amountRepay,
        type: campaign.campaignName,
        amountToBeRepaidPerTime: amountPerTime,
        amountAlreadyRepaid: amountAlreadyRaise,
        firstPaymentDate: campaign.firstPaymentDate,
        lastPaymentDate: campaign.endDatePledgedProfit,
        campaignId,
        recipientId: recipient.id,
        userId,
      };
      const donation = await createDonation(donationInfo);
      successResponse(res, {...donation}, 201);
    }
  } catch (error) {
    errorResponse(res, {
      code: error.statusCode,
      message: error.message,
    });
  }
};

/**
           * Get all Donations
           *
           * @static
           * @param {Request} req - The request from the browser.
           * @param {Response} res - The response returned by the method.
           * @return { JSON } A JSON response all the created Donations.
           * @memberof DonationController
           */
export const getAllDonations = async (req, res) => {
  try {
    const Donations = await fetchAllDonations();

    res.status(200).json({
      success: true,
      Donations,
    });
    successResponse(res, {...Donations}, 201);
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
           * @memberof DonationController
           */
export const getDonationDetails = async (req, res) => {
  try {
    const id = req.params.donationId;
    const Donation = await findDonationBy({id});
    const DonationResponse = extractDonationData(Donation);
    successResponse(res, DonationResponse, 200);
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};

/**
           * Updates a Donation profile (admin)
           *

           * @param {Request} req - The request from the endpoint.
           * @param {Response} res - The response returned by the method.
           * @param {Response} next - The response returned by the method.
           * @return { JSON } A JSON response with the new Donation's
           *  profile update.
           * @memberof DonationController
           */
export const updateDonationProfile= async (req, res, next) => {
  try {
    const id = req.params.donationId;
    const Donation = await findDonationBy({id});

    if (!Donation) {
      throw new ApiError(404, `Donation with id: ${id} does not exist`);
    } else if (Donation.DonationLiveStatus === 'false') {
      throw new ApiError(404, `This Donation has already ended.`);
    } else {
      const id = req.params.donationId;
      //   const Donation = await findDonationBy({id});
      // eslint-disable-next-line max-len
      // const newAmount = amountAlreadyRaised+Donation.amountAlreadyRaised;
      const updatedDonation = await updateDonationBy(req.body, {id});
      const DonationResponse = extractDonationData(updatedDonation);
      successResponse(res, DonationResponse, 200);
    }
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};


/**
              * Deletes a Donation on a travel request.
              *
              * @param {Request} req - The request from the endpoint.
              * @param {Response} res - The response returned by the method.
              * @return { JSON } A JSON response containing with an empty data
              *  object.
              * @memberof DonationController
              */
export const deleteDonationAction = async (req, res) => {
  try {
    const donationId = req.params.donationId;
    const rowDeleted = await deleteDonationById(donationId);
    if (!rowDeleted) return errorResponse(res, {});
    successResponse(res, {id: donationId}, 200);
  } catch (err) {
    errorResponse(res, {});
  }
};

/**
             *
             *  Get profile Donation details
             * @static
             * @param {Request} req - The request from the endpoint.
             * @param {Response} res - The response returned by the method.
             * @param {Response} next - The response returned by the method.
             * @memberof Auth
             */
export const getMyDonationDetails = async (req, res, next) => {
  try {
    const Donations = await findDonationsBy({userId: req.user.id});
    if (!Donations) {
      return errorResponse(res, {code: 401, message:
                    // eslint-disable-next-line max-len
                    'This user does not exist or is logged out. Please login or sign up.'});
    }
    res.status(200).json({
      success: true,
      Donations,
    });
    successResponse(res, {...Donations}, 201);
  } catch (error) {
    errorResponse(res, {});
  }
};

/**
             *
             *  Get profile Donation details
             * @static
             * @param {Request} req - The request from the endpoint.
             * @param {Response} res - The response returned by the method.
             * @param {Response} next - The response returned by the method.
             * @memberof Auth
             */
export const getMyDonationRecievedDetails = async (req, res, next) => {
  try {
    const {count, rows} = await findDonationsAndCountBy({recipientId: req.user.id});
    if (!rows) {
      return errorResponse(res, {code: 401, message:
                    // eslint-disable-next-line max-len
                    'This user does not exist or is logged out. Please login or sign up.'});
    }
    res.status(200).json({
      success: true,
      count, rows,
    });
    successResponse(res, {...Donations}, 201);
  } catch (error) {
    errorResponse(res, {});
  }
};

/**
             *
             *  Get profile Donation details
             * @static
             * @param {Request} req - The request from the endpoint.
             * @param {Response} res - The response returned by the method.
             * @param {Response} next - The response returned by the method.
             * @memberof Auth
             */
export const getMyDonationRecievedSum = async (req, res, next) => {
  try {
    const amount = await findDonationsSum({recipientId: req.user.id});
    if (!amount) {
      return errorResponse(res, {code: 401, message:
                    // eslint-disable-next-line max-len
                    'This user does not exist or is logged out. Please login or sign up.'});
    }
    res.status(200).json({
      success: true,
      amount,
    });
    successResponse(res, {...Donations}, 201);
  } catch (error) {
    errorResponse(res, {});
  }
};

/**
             *
             *  Get profile Donation details
             * @static
             * @param {Request} req - The request from the endpoint.
             * @param {Response} res - The response returned by the method.
             * @param {Response} next - The response returned by the method.
             * @memberof Auth
             */
export const getMyDebtSum = async (req, res, next) => {
  try {
    const amount = await findDebtSum({recipientId: req.user.id});
    if (!amount) {
      return errorResponse(res, {code: 401, message:
                    // eslint-disable-next-line max-len
                    'This user does not exist or is logged out. Please login or sign up.'});
    }
    res.status(200).json({
      success: true,
      amount,
    });
    successResponse(res, {...Donations}, 201);
  } catch (error) {
    errorResponse(res, {});
  }
};

/**
             *
             *  Get profile Donation details
             * @static
             * @param {Request} req - The request from the endpoint.
             * @param {Response} res - The response returned by the method.
             * @param {Response} next - The response returned by the method.
             * @memberof Auth
             */
export const getDonationDetailsUser = async (req, res, next) => {
  try {
    const Donations = await findDonationsBy({userId: req.params.userId});
    if (!Donations) {
      return errorResponse(res, {code: 401, message:
                    // eslint-disable-next-line max-len
                    'This user does not exist or is logged out. Please login or sign up.'});
    }
    res.status(200).json({
      success: true,
      Donations,
    });
    successResponse(res, {...Donations}, 201);
  } catch (error) {
    errorResponse(res, {});
  }
};

/**
             *
             *  Get profile Donation details
             * @static
             * @param {Request} req - The request from the endpoint.
             * @param {Response} res - The response returned by the method.
             * @param {Response} next - The response returned by the method.
             * @memberof Auth
             */
export const getDonationSumUser = async (req, res, next) => {
  try {
    const sum = await findDonationsSum({userId: req.params.userId});
    if (!sum) {
      return errorResponse(res, {code: 401, message:
                    // eslint-disable-next-line max-len
                    'This user does not exist or is logged out. Please login or sign up.'});
    }
    res.status(200).json({
      success: true,
      sum,
    });
    // successResponse(res, {...Donations}, 201);
  } catch (error) {
    errorResponse(res, {});
  }
};


/**
             *
             *  Get profile Donation details
             * @static
             * @param {Request} req - The request from the endpoint.
             * @param {Response} res - The response returned by the method.
             * @param {Response} next - The response returned by the method.
             * @memberof Auth
             */
export const getDonationRecievedDetailsUser = async (req, res, next) => {
  try {
    const {count, rows} = await findDonationsAndCountBy({recipientId: req.params.userId});
    if (!rows) {
      return errorResponse(res, {code: 401, message:
                    // eslint-disable-next-line max-len
                    'This user does not exist or is logged out. Please login or sign up.'});
    }
    res.status(200).json({
      success: true,
      count, rows,
    });
    successResponse(res, {...Donations}, 201);
  } catch (error) {
    errorResponse(res, {});
  }
};

/**
             *
             *  Get profile Donation details
             * @static
             * @param {Request} req - The request from the endpoint.
             * @param {Response} res - The response returned by the method.
             * @param {Response} next - The response returned by the method.
             * @memberof Auth
             */
export const getDonationRecievedSumUser = async (req, res, next) => {
  try {
    const amount = await findDonationsSum({recipientId: req.params.userId});
    if (!amount) {
      return errorResponse(res, {code: 401, message:
                    // eslint-disable-next-line max-len
                    'This user does not exist or is logged out. Please login or sign up.'});
    }
    res.status(200).json({
      success: true,
      amount,
    });
    successResponse(res, {...Donations}, 201);
  } catch (error) {
    errorResponse(res, {});
  }
};

/**
             *
             *  Get profile Donation details
             * @static
             * @param {Request} req - The request from the endpoint.
             * @param {Response} res - The response returned by the method.
             * @param {Response} next - The response returned by the method.
             * @memberof Auth
             */
export const getDebtSumUser = async (req, res, next) => {
  try {
    const amount = await findDebtSum({recipientId: req.params.userId});
    if (!amount) {
      return errorResponse(res, {code: 401, message:
                    // eslint-disable-next-line max-len
                    'This user does not exist or is logged out. Please login or sign up.'});
    }
    res.status(200).json({
      success: true,
      amount,
    });
    successResponse(res, {...Donations}, 201);
  } catch (error) {
    errorResponse(res, {});
  }
};

/**
       * Get reviews that belong to a particular campaing.
       *
       * @static
       * @param {Request} req - The request from the browser.
       * @param {Response} res - The response returned by the method.
       * @return { JSON } A JSON response with the newly created booking.
       * @memberof CampaignReviewController
       */
export const getDonationsCampaign = async (req, res) => {
  try {
    const id = req.params.campaignId;
    const {count, rows} = await findDonationsAndCountBy({campaignId: id});
    res.status(200).json({
      success: true,
      count,
      rows,
    });
    // successResponse(res, campaingReviews, 200);
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};

/**
       * Get reviews that belong to a particular campaing.
       *
       * @static
       * @param {Request} req - The request from the browser.
       * @param {Response} res - The response returned by the method.
       * @return { JSON } A JSON response with the newly created booking.
       * @memberof CampaignReviewController
       */
export const getDonationsSumCampaign = async (req, res) => {
  try {
    const id = req.params.campaignId;
    const amount = await findDonationsSum({campaignId: id});
    res.status(200).json({
      success: true,
      amount,
    });
    // successResponse(res, campaingReviews, 200);
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};


/**
       * Get reviews that belong to a particular campaing.
       *
       * @static
       * @param {Request} req - The request from the browser.
       * @param {Response} res - The response returned by the method.
       * @return { JSON } A JSON response with the newly created booking.
       * @memberof CampaignReviewController
       */
export const getDebtCampaign = async (req, res) => {
  try {
    const id = req.params.campaignId;
    const amount = await findSumBy({campaignId: id});
    res.status(200).json({
      success: true,
      amount,
    });
    // successResponse(res, campaingReviews, 200);
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};

