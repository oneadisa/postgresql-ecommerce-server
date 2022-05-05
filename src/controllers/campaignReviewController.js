import {successResponse, errorResponse,
  extractCampaignReviewData,
  //  extractCampaignData
} from '../utils/helpers';
import {findBusinessBy, findUserBy,
  // findCampaignBy
} from '../services';

import {createCampaignReview, findCampaignReviewBy, findCampaignReviewsBy,
  updateCampaignReviewBy, findCampaignReviewsAndCountBy,
  fetchAllCampaignReviews, deleteCampaignReview,
} from '../services';


/**
       * Creates a new CampaignReview.
       *
       * @param {Request} req The request from the endpoint.
       * @param {Response} res The response returned by the method.
       * @memberof BusinnessController
       * @return {JSON} A JSON response with
       *  the created CampaignReview's details.
       */
export const addCampaignReview = async (req, res) => {
  try {
    const {
      comment,
      campaignId,
      userId,
    } = req.body;
    const business = await findBusinessBy({userId});
    const user = await findUserBy({id: userId});
    if (business) {
      const campaingReviewInfo = {
        comment,
        firstName: user.firstName,
        lastName: user.lastName,
        businessName: business.businessName,
        campaignId,
        userId,
      };
      const review = await findCampaignReviewBy({campaignId, userId});
      if (review) {
        const campaingReview = await updateCampaignReviewBy(req.body,
            {campaignId, userId});
        const campaingReviewResponse =
        extractCampaignReviewData(campaingReview);
        successResponse(res, campaingReviewResponse, 200);
      } else {
        const campaingReview = await createCampaignReview(campaingReviewInfo);
        // const previousCampaign = await findCampaignBy({id: campaignId});
        // const newReviewCount = previousCampaign.numberOfReviews + 1;
        const campaingReviewResponse =
          extractCampaignReviewData(campaingReview);
        successResponse(res, campaingReviewResponse, 201);
        // successResponse(res, {...campaingReview}, 201);
      }
    } else {
      const campaingReviewInfo = {
        comment,
        firstName: user.firstName,
        lastName: user.lastName,
        campaignId,
        userId,
      };
      const review = await findCampaignReviewBy({campaignId, userId});
      if (review) {
        const campaingReview = await updateCampaignReviewBy(req.body,
            {campaignId, userId});
        const campaingReviewResponse =
        extractCampaignReviewData(campaingReview);
        successResponse(res, campaingReviewResponse, 200);
      } else {
        const campaingReview = await createCampaignReview(campaingReviewInfo);
        // const previousCampaign = await findCampaignBy({id: campaignId});
        // const newReviewCount = previousCampaign.numberOfReviews + 1;
        const campaingReviewResponse =
          extractCampaignReviewData(campaingReview);
        successResponse(res, campaingReviewResponse, 201);
        // successResponse(res, {...campaingReview}, 201);
      }
    }
  } catch (error) {
    errorResponse(res, {
      code: error.statusCode,
      message: error.message,
    });
  }
};

/**
       * Get all campaingReviews
       *
       * @static
       * @param {Request} req - The request from the browser.
       * @param {Response} res - The response returned by the method.
       * @return { JSON } A JSON response all the created campaingReviews.
       * @memberof BookingController
       */
export const getAllCampaignReviews = async (req, res) => {
  try {
    const campaingReviews = await fetchAllCampaignReviews();

    return res.status(200).json({
      success: true,
      data: campaingReviews,
    });
    successResponse(res, {...campaingReviews}, 201);
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
       * @memberof CampaignReviewController
       */
export const getCampaignReviewDetails = async (req, res) => {
  try {
    const id = req.params.campaingReviewId;
    const campaingReview = await findCampaignReviewBy({id});
    const campaingReviewResponse = extractCampaignReviewData(campaingReview);
    successResponse(res, campaingReviewResponse, 200);
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
export const getCampaignReviewsCampaign = async (req, res) => {
  try {
    const id = req.params.campaignId;
    const {count, rows} = await findCampaignReviewsAndCountBy({campaignId: id});
    // const userResponse = extractUserData(user);
    return res.status(200).json({
      success: true,
      count,
      rows,
    });
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};

/**
       * Updates a campaingReview profile (admin)
       *

       * @param {Request} req - The request from the endpoint.
       * @param {Response} res - The response returned by the method.
       * @return { JSON } A JSON response with the new campaingReview's
       *  profile update.
       * @memberof CampaignReviewController
       */
export const updateCampaignReviewProfile= async (req, res) => {
  try {
    const id = req.params.campaingReviewId;
    const campaingReview = await updateCampaignReviewBy(req.body, {id});
    const campaingReviewResponse = extractCampaignReviewData(campaingReview);
    successResponse(res, campaingReviewResponse, 200);
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};


/**
          * Deletes a campaingReview on a travel request.
          *
          * @param {Request} req - The request from the endpoint.
          * @param {Response} res - The response returned by the method.
          * @return { JSON } A JSON response containing with
          *  an empty data object.
          * @memberof CampaignReviewController
          */
export const deleteCampaignReviewAction = async (req, res) => {
  try {
    const campaingReviewId = req.params.campaingReviewId;
    const rowDeleted = await deleteCampaignReview(campaingReviewId);
    if (!rowDeleted) return errorResponse(res, {});
    successResponse(res, {id: campaingReviewId}, 200);
  } catch (err) {
    errorResponse(res, {});
  }
};

/**
         *
         *  Get profile details
         * @static
         * @param {Request} req - The request from the endpoint.
         * @param {Response} res - The response returned by the method.
         * @param {Response} next - The response returned by the method.
         * @memberof Auth
         */
export const getMyCampaignReviewDetails = async (req, res, next) => {
  try {
    const campaingReviews = await findCampaignReviewsBy({userId: req.user.id});
    if (!campaingReviews) {
      return errorResponse(res, {code: 401, message:
                'This user exists or is logged out. Please login or sign up.'});
    }
    return res.status(200).json({
      success: true,
      campaingReviews,
    });
    successResponse(res, {...campaingReviews}, 201);
  } catch (error) {
    errorResponse(res, {});
  }
};

/**
         *
         *  Get profile details
         * @static
         * @param {Request} req - The request from the endpoint.
         * @param {Response} res - The response returned by the method.
         * @param {Response} next - The response returned by the method.
         * @memberof Auth
         */
export const getCampaignReviewDetailsUser = async (req, res, next) => {
  try {
    // eslint-disable-next-line max-len
    const campaingReviews = await findCampaignReviewsBy({userId: req.params.userId});
    if (!campaingReviews) {
      return errorResponse(res, {code: 401, message:
                'This user exists or is logged out. Please login or sign up.'});
    }
    return res.status(200).json({
      success: true,
      campaingReviews,
    });
    // successResponse(res, {...campaingReviews}, 201);
  } catch (error) {
    errorResponse(res, {});
  }
};
