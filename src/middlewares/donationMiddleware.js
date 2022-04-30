import {errorResponse} from '../utils/helpers';
import {findUserBy} from '../services';
import {validateDonation} from '../validation';

/**
 * Middleware method for donation validation during donation creation
 * @param {Response} req The request from the endpoint.
 * @param {Response} res The response returned by the method.
 * @param {object} next the returned values going into the next operation.
 * @return {object} returns an object (error or response).
 */
export const onDonationCreation = async (req, res, next) => {
  try {
    const validated = await validateDonation(req.body);
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

