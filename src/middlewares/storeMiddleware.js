import {errorResponse} from '../utils/helpers';
import {findStoreBy, findUserBy, findBusinessBy} from '../services';
import {validateStore} from '../validation';

/**
 * Middleware method for business validation during business creation
 * @param {Response} req The request from the endpoint.
 * @param {Response} res The response returned by the method.
 * @param {object} next the returned values going into the next operation.
 * @return {object} returns an object (error or response).
 */
export const onStoreCreation = async (req, res, next) => {
  try {
    const validated = await validateStore(req.body);
    if (validated) {
      const {storeLink, userId, businessId} = req.body;
      const store = await findStoreBy({storeLink});
      const user = await findUserBy({id: userId});
      const business = await findBusinessBy({id: businessId});
      // const {storeLink}= req.body;
      // const user = await findUserBy({id: req.user.id});
      // const business = await findBusinessBy({userId: req.user.id});
      // const store = await findStoreBy({storeLink});
      if (store) {
        errorResponse(res, {
          code: 409,
          message: `Store with the link: ${storeLink} already exists`,
        });
      } else if (!user) {
        errorResponse(res, {
          code: 404,
          message: `User with id: ${userId} does not exist`,
        });
      } else if (!business) {
        errorResponse(res, {
          code: 404,
          message: `Business with id: ${businessId} does not exist`,
        });
      } else if (user.accountType !== 'business') {
        errorResponse(res, {
          code: 403,
          message: 'Only business users are allowed to create a store',
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
