import {errorResponse} from '../utils/helpers';
import {findUserBy} from '../services';
import {validateCampaignReview} from '../validation';

/**
 * Middleware method for review validation during review creation
 * @param {Response} req The request from the endpoint.
 * @param {Response} res The response returned by the method.
 * @param {object} next the returned values going into the next operation.
 * @return {object} returns an object (error or response).
 */
export const onCampaignReviewCreation = async (req, res, next) => {
  try {
    const validated = await validateCampaignReview(req.body);
    if (validated) {
      const {userId} = req.body;
      const user = await findUserBy({id: userId});
      if (!user) {
        errorResponse(res, {
          code: 404,
          message: `User with id: ${userId} does not exist.
        Please sign up to submit a review.`,
        });
      } else {
        next();
      }
    }
  } catch (error) {
    errorResponse(res, {
      code: error.status, message: error.message,
    });
  }
};

// else if (!user) {
// errorResponse(res, {
// code: 404,
// message: `User with id: ${userId} does not exist`,
// });
// }
