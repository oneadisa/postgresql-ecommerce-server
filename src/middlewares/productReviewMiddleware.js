import {errorResponse} from '../utils/helpers';
import {findUserBy} from '../services';
import {validateProductReview} from '../validation';

/**
 * Middleware method for store validation during store creation
 * @param {Response} req The request from the endpoint.
 * @param {Response} res The response returned by the method.
 * @param {object} next the returned values going into the next operation.
 * @return {object} returns an object (error or response).
 */
export const onProductReviewCreation = async (req, res, next) => {
  try {
    const validated = await validateProductReview(req.body);
    if (validated) {
      const {userId} = req.body;
      const user = await findUserBy({id: userId});
      // const {storeLink}= req.body;
      // const user = await findUserBy({id: req.user.id});
      // const store = await findStoreBy({userId: req.user.id});
      // const store = await findProductBy({storeLink});
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
