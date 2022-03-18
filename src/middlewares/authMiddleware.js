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


/**
      * Middleware method for user validation during login
      * @param {object} req - The request from the endpoint.
      * @param {object} res - The response returned by the method.
      * @param {object} next - Call the next operation.
      * @return {object} - Returns an object (error or response).
      */
export const onUserLogin=async (req, res, next)=> {
  try {
    const validated = await userLogin(req.body);
    if (validated) {
      next();
    }
  } catch (error) {
    errorResponse(res, {code: 400, message: error.details[0].context.label});
  }
};


/**
  * Middleware method for user authentication
  * @param {object} req - The request from the endpoint.
  * @param {object} res - The response returned by the method.
  * @param {object} next - the returned values going into the next operation.
  */
export const isAuthenticated=(req, res, next)=> {
  try {
    const {userId} = req.params;
    const token = checkToken(req);
    const decoded = verifyToken(token);
    req.user = decoded;
    const {id} = decoded;
    if (Number(userId) === id) {
      next();
    } else {
      throw new ApiError(401, 'Access denied, check your inputed details');
    }
  } catch (err) {
    const status = err.status || 500;
    errorResponse(res, {code: status, message: err.message});
  }
};
/**
  * Middleware method for authentication
  * @param {object} req - The request from the endpoint.
  * @param {object} res - The response returned by the method.
  * @param {object} next - the returned values going into the next operation.
  */
export const authenticate = (req, res, next) => {
  try {
    const token = checkToken(req);
    if (!token) return;
    errorResponse(res, {code: 401, message: 'Access denied, Token required'});
    const decoded = verifyToken(token);
    req.data = decoded;
    next();
  } catch (err) {
    errorResponse(res, {code: 401, message: err.message});
  }
};

/**
  * Middleware method for authentication
  * @param {object} req - The request from the endpoint.
  * @param {object} res - The response returned by the method.
  * @param {object} next - the returned values going into the next operation.
  */
export const isAuthenticatedUser = async (req, res, next) => {
  const {token} = req.cookies;

  if (!token) {
    return next(new ErrorHander('Please Login to access this resource', 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decodedData.id);

  next();
};
