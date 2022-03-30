import {errorResponse} from '../utils/helpers';
import {findUserBy, findStoreBy} from '../services';
import {validateProductImage} from '../validation';

/**
 * Middleware method for product validation during product creation
 * @param {Response} req The request from the endpoint.
 * @param {Response} res The response returned by the method.
 * @param {object} next the returned values going into the next operation.
 * @return {object} returns an object (error or response).
 */
export const onProductImageCreation = async (req, res, next) => {
  try {
    const validated = await validateProductImage(req.body);
    if (validated) {
      const {userId} = req.body;
      const user = await findUserBy({id: userId});
      const store = await findStoreBy({userId});
      // const {storeLink}= req.body;
      // const user = await findUserBy({id: req.user.id});
      // const store = await findStoreBy({userId: req.user.id});
      // const store = await findProductImageBy({storeLink});
      if (!user) {
        errorResponse(res, {
          code: 404,
          message: `User with id: ${userId} does not exist`,
        });
      } else if (!store) {
        errorResponse(res, {
          code: 404,
          message: `Store does not exist,
           please create one before you can add a product image.`,
        });
      } else if (user.accountType !== 'business') {
        errorResponse(res, {
          code: 403,
          message: 'Only business users are allowed to create a product image.',
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
