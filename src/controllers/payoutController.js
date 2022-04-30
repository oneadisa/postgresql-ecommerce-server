/* eslint-disable max-len */
import {successResponse, errorResponse,
  extractPayoutData} from '../utils/helpers';
import ApiError from '../utils/apiError';
import {findPayoutBy, findPayoutsBy, findPayoutsAndCountBy,
  updatePayoutBy, findPayoutsSum, findPayoutDebtSum,
  fetchAllPayouts, deletePayoutById,
} from '../services';

/**
           * Get all Payouts
           *
           * @static
           * @param {Request} req - The request from the browser.
           * @param {Response} res - The response returned by the method.
           * @return { JSON } A JSON response all the created Payouts.
           * @memberof PayoutController
           */
export const getAllPayouts = async (req, res) => {
  try {
    const Payouts = await fetchAllPayouts();

    res.status(200).json({
      success: true,
      Payouts,
    });
    successResponse(res, {...Payouts}, 201);
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
             * @memberof PayoutController
             */
export const getPayoutDetails = async (req, res) => {
  try {
    const id = req.params.payoutId;
    const Payout = await findPayoutBy({id});
    const PayoutResponse = extractPayoutData(Payout);
    successResponse(res, PayoutResponse, 200);
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};

/**
             * Updates a Payout profile (admin)
             *

             * @param {Request} req - The request from the endpoint.
             * @param {Response} res - The response returned by the method.
             * @param {Response} next - The response returned by the method.
             * @return { JSON } A JSON response with the new Payout's
             *  profile update.
             * @memberof PayoutController
             */
export const updatePayoutProfile= async (req, res, next) => {
  try {
    const id = req.params.payoutId;
    const Payout = await findPayoutBy({id});

    if (!Payout) {
      throw new ApiError(404, `Payout with id: ${id} does not exist`);
    } else if (Payout.PayoutLiveStatus === 'false') {
      throw new ApiError(404, `This Payout has already ended.`);
    } else {
      const id = req.params.payoutId;
      //   const Payout = await findPayoutBy({id});
      // eslint-disable-next-line max-len
      // const newAmount = amountAlreadyRaised+Payout.amountAlreadyRaised;
      const updatedPayout = await updatePayoutBy(req.body, {id});
      const PayoutResponse = extractPayoutData(updatedPayout);
      successResponse(res, PayoutResponse, 200);
    }
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};


/**
                * Deletes a Payout on a travel request.
                *
                * @param {Request} req - The request from the endpoint.
                * @param {Response} res - The response returned by the method.
                * @return { JSON } A JSON response containing with an empty data
                *  object.
                * @memberof PayoutController
                */
export const deletePayoutAction = async (req, res) => {
  try {
    const payoutId = req.params.payoutId;
    const rowDeleted = await deletePayoutById(payoutId);
    if (!rowDeleted) return errorResponse(res, {});
    successResponse(res, {id: payoutId}, 200);
  } catch (err) {
    errorResponse(res, {});
  }
};

/**
               *
               *  Get profile Payout details
               * @static
               * @param {Request} req - The request from the endpoint.
               * @param {Response} res - The response returned by the method.
               * @param {Response} next - The response returned by the method.
               * @memberof Auth
               */
export const getMyPayoutDetails = async (req, res, next) => {
  try {
    const {count, rows} = await findPayoutsAndCountBy({userId: req.user.id});
    if (!rows) {
      return errorResponse(res, {code: 401, message:
                      // eslint-disable-next-line max-len
                      'This user does not exist or is logged out. Please login or sign up.'});
    }
    res.status(200).json({
      success: true,
      count,
      rows,
    });
    successResponse(res, {...payouts}, 201);
  } catch (error) {
    errorResponse(res, {});
  }
};

/**
               *
               *  Get profile Payout details
               * @static
               * @param {Request} req - The request from the endpoint.
               * @param {Response} res - The response returned by the method.
               * @param {Response} next - The response returned by the method.
               * @memberof Auth
               */
export const getMyPayoutRecievedDetails = async (req, res, next) => {
  try {
    const {count, rows} = await findPayoutsAndCountBy({recipientId: req.user.id});
    if (!rows) {
      return errorResponse(res, {code: 401, message:
                      // eslint-disable-next-line max-len
                      'This user does not exist or is logged out. Please login or sign up.'});
    }
    res.status(200).json({
      success: true,
      count, rows,
    });
    successResponse(res, {...Payouts}, 201);
  } catch (error) {
    errorResponse(res, {});
  }
};

/**
               *
               *  Get profile Payout details
               * @static
               * @param {Request} req - The request from the endpoint.
               * @param {Response} res - The response returned by the method.
               * @param {Response} next - The response returned by the method.
               * @memberof Auth
               */
export const getMyPayoutRecievedSum = async (req, res, next) => {
  try {
    const amount = await findPayoutsSum({recipientId: req.user.id});
    if (!amount) {
      return errorResponse(res, {code: 401, message:
                      // eslint-disable-next-line max-len
                      'This user does not exist or is logged out. Please login or sign up.'});
    }
    res.status(200).json({
      success: true,
      amount,
    });
    successResponse(res, {...Payouts}, 201);
  } catch (error) {
    errorResponse(res, {});
  }
};

/**
               *
               *  Get profile Payout details
               * @static
               * @param {Request} req - The request from the endpoint.
               * @param {Response} res - The response returned by the method.
               * @param {Response} next - The response returned by the method.
               * @memberof Auth
               */
export const getMyPayoutDebtSum = async (req, res, next) => {
  try {
    const amount = await findPayoutDebtSum({recipientId: req.user.id});
    if (!amount) {
      return errorResponse(res, {code: 401, message:
                      // eslint-disable-next-line max-len
                      'This user does not exist or is logged out. Please login or sign up.'});
    }
    res.status(200).json({
      success: true,
      amount,
    });
    successResponse(res, {...Payouts}, 201);
  } catch (error) {
    errorResponse(res, {});
  }
};

/**
               *
               *  Get profile Payout details
               * @static
               * @param {Request} req - The request from the endpoint.
               * @param {Response} res - The response returned by the method.
               * @param {Response} next - The response returned by the method.
               * @memberof Auth
               */
export const getPayoutDetailsUser = async (req, res, next) => {
  try {
    const Payouts = await findPayoutsBy({userId: req.params.userId});
    if (!Payouts) {
      return errorResponse(res, {code: 401, message:
                      // eslint-disable-next-line max-len
                      'This user does not exist or is logged out. Please login or sign up.'});
    }
    res.status(200).json({
      success: true,
      Payouts,
    });
    successResponse(res, {...Payouts}, 201);
  } catch (error) {
    errorResponse(res, {});
  }
};

/**
               *
               *  Get profile Payout details
               * @static
               * @param {Request} req - The request from the endpoint.
               * @param {Response} res - The response returned by the method.
               * @param {Response} next - The response returned by the method.
               * @memberof Auth
               */
export const getPayoutSumUser = async (req, res, next) => {
  try {
    const sum = await findPayoutsSum({userId: req.params.userId});
    if (!sum) {
      return errorResponse(res, {code: 401, message:
                      // eslint-disable-next-line max-len
                      'This user does not exist or is logged out. Please login or sign up.'});
    }
    res.status(200).json({
      success: true,
      sum,
    });
    // successResponse(res, {...Payouts}, 201);
  } catch (error) {
    errorResponse(res, {});
  }
};


/**
               *
               *  Get profile Payout details
               * @static
               * @param {Request} req - The request from the endpoint.
               * @param {Response} res - The response returned by the method.
               * @param {Response} next - The response returned by the method.
               * @memberof Auth
               */
export const getPayoutRecievedDetailsUser = async (req, res, next) => {
  try {
    const {count, rows} = await findPayoutsAndCountBy({recipientId: req.params.userId});
    if (!rows) {
      return errorResponse(res, {code: 401, message:
                      // eslint-disable-next-line max-len
                      'This user does not exist or is logged out. Please login or sign up.'});
    }
    res.status(200).json({
      success: true,
      count, rows,
    });
    successResponse(res, {...Payouts}, 201);
  } catch (error) {
    errorResponse(res, {});
  }
};

/**
               *
               *  Get profile Payout details
               * @static
               * @param {Request} req - The request from the endpoint.
               * @param {Response} res - The response returned by the method.
               * @param {Response} next - The response returned by the method.
               * @memberof Auth
               */
export const getPayoutRecievedSumUser = async (req, res, next) => {
  try {
    const amount = await findPayoutsSum({recipientId: req.params.userId});
    if (!amount) {
      return errorResponse(res, {code: 401, message:
                      // eslint-disable-next-line max-len
                      'This user does not exist or is logged out. Please login or sign up.'});
    }
    res.status(200).json({
      success: true,
      amount,
    });
    successResponse(res, {...Payouts}, 201);
  } catch (error) {
    errorResponse(res, {});
  }
};

/**
               *
               *  Get profile Payout details
               * @static
               * @param {Request} req - The request from the endpoint.
               * @param {Response} res - The response returned by the method.
               * @param {Response} next - The response returned by the method.
               * @memberof Auth
               */
export const getPayoutDebtSumUser = async (req, res, next) => {
  try {
    const amount = await findPayoutDebtSum({recipientId: req.params.userId});
    if (!amount) {
      return errorResponse(res, {code: 401, message:
                      // eslint-disable-next-line max-len
                      'This user does not exist or is logged out. Please login or sign up.'});
    }
    res.status(200).json({
      success: true,
      amount,
    });
    successResponse(res, {...Payouts}, 201);
  } catch (error) {
    errorResponse(res, {});
  }
};

/**
         * Get payouts that belong to a particular campaing.
         *
         * @static
         * @param {Request} req - The request from the browser.
         * @param {Response} res - The response returned by the method.
         * @return { JSON } A JSON response with the newly created booking.
         * @memberof CampaignReviewController
         */
export const getPayoutsCampaign = async (req, res) => {
  try {
    const id = req.params.campaignId;
    const {count, rows} = await findPayoutsAndCountBy({campaignId: id});
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
         * Get payouts that belong to a particular campaing.
         *
         * @static
         * @param {Request} req - The request from the browser.
         * @param {Response} res - The response returned by the method.
         * @return { JSON } A JSON response with the newly created booking.
         * @memberof CampaignReviewController
         */
export const getPayoutsSumCampaign = async (req, res) => {
  try {
    const id = req.params.campaignId;
    const amount = await findPayoutsSum({campaignId: id});
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
         * Get payouts that belong to a particular campaing.
         *
         * @static
         * @param {Request} req - The request from the browser.
         * @param {Response} res - The response returned by the method.
         * @return { JSON } A JSON response with the newly created booking.
         * @memberof CampaignReviewController
         */
export const getPayoutDebtCampaign = async (req, res) => {
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

/**
         * Get payouts that belong to a particular campaing.
         *
         * @static
         * @param {Request} req - The request from the browser.
         * @param {Response} res - The response returned by the method.
         * @return { JSON } A JSON response with the newly created booking.
         * @memberof CampaignReviewController
         */
export const getMyPayoutsCampaign = async (req, res) => {
  try {
    const id = req.params.campaignId;
    const {count, rows} = await findPayoutsAndCountBy({campaignId: id, userId: req.user.id});
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

