import {errorResponse} from '../utils/helpers';
import {findUserBy} from '../services';
import {validateTransaction} from '../validation';

/**
 * Middleware method for transaction validation during transaction creation
 * @param {Response} req The request from the endpoint.
 * @param {Response} res The response returned by the method.
 * @param {object} next the returned values going into the next operation.
 * @return {object} returns an object (error or response).
 */
export const onTransactionCreation = async (req, res, next) => {
  try {
    const validated = await validateTransaction(req.body);
    if (validated) {
      const {userId} = req.body;
      const user = await findUserBy({id: userId});
      if (!user) {
        errorResponse(res, {
          code: 404,
          message: `User with id: ${userId} does not exist.
        Please sign up to create a transaction.`,
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

