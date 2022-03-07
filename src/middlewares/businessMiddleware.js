import {errorResponse} from '../utils/helpers';
import {findBusinessBy, findUserBy} from '../services';
import {validateBusiness} from '../validation';

/**
 * Middleware method for business validation during business creation
 * @param {Response} req The request from the endpoint.
 * @param {Response} res The response returned by the method.
 * @param {object} next the returned values going into the next operation.
 * @return {object} returns an object (error or response).
 */
export const onBusinessCreation = async (req, res, next) => {
  try {
    const validated = await validateBusiness(req.body);
    if (validated) {
      const {businessEmail, userId} = req.body;
      const business = await findBusinessBy({businessEmail});
      const user = await findUserBy({id: userId});
      if (business) {
        errorResponse(res, {
          code: 409,
          message: `Business with email: ${businessEmail} already exists`,
        });
      } else if (!user) {
        errorResponse(res, {
          code: 404,
          message: `User with id: ${userId} does not exist`,
        });
      } else if (user.accountType !== 'business') {
        errorResponse(res, {
          code: 403,
          message: 'Only business users are allowed to create a business',
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
