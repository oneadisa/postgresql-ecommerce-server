import {errorResponse} from '../utils/helpers';
// import {findUserBy, findStoreBy} from '../services';
import {validateOrder} from '../validation';

/**
 * Middleware method for order validation during order creation
 * @param {Response} req The request from the endpoint.
 * @param {Response} res The response returned by the method.
 * @param {object} next the returned values going into the next operation.
 * @return {object} returns an object (error or response).
 */
export const onOrderCreation = async (req, res, next) => {
  try {
    const validated = await validateOrder(req.body);
    if (validated) {
      next();
    }
  } catch (error) {
    errorResponse(res, {
      code: error.status, message: error.message,
    });
  }
};
