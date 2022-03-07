import {errorResponse} from '../utils/helpers';
import {findUserBy} from '../services';
import {validateUserSignup} from '../validation';

/**
 * Middleware method for user validation during signup/registration
 * @param {Response} req The request from the endpoint.
 * @param {Response} res The response returned by the method.
 * @param {object} next the returned values going into the next operation.
 * @return {object} returns an object (error or response).
 */
export const onUserSignup = async (req, res, next) => {
  try {
    const validated = await validateUserSignup(req.body);
    if (validated) {
      const {email} = req.body;
      const user = await findUserBy({email});
      if (user) {
        errorResponse(res, {code: 409,
          message: `User with email: ${email} already exists`});
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
