import {errorResponse} from '../utils/helpers';
import {findUserBy} from '../services';
import {validateUserSignup, userLogin} from '../validation';
import jwt from 'jsonwebtoken';
import ApiError from '../utils/apiError';
// import db from '../database/models';

// const {User} = db;

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
  * Middleware method for authentication
  * @param {object} req - The request from the endpoint.
  * @param {object} res - The response returned by the method.
  * @param {object} next - the returned values going into the next operation.
  */
export const authenticate = async (req, res, next) => {
  try {
    const {token} = req.cookies;
    if (!token) return;
    errorResponse(res, {code: 401, message: 'Access denied, Token required'});
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = await findUserBy(decoded.id);
    next();
  } catch (err) {
    errorResponse(res, {code: 401, message: err.message});
  }
};

/**
  * Middleware method for user authentication
  * @param {object} req - The request from the endpoint.
  * @param {object} res - The response returned by the method.
  * @param {object} next - the returned values going into the next operation.
  * @return {object} - next().
  */
export const isAuthenticated= async (req, res, next) =>{
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const {userId} = req.params;

      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, ''+process.env.SECRET);
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
  }
};

/**
  * Middleware method for user authentication
  * @param {object} req - The request from the endpoint.
  * @param {object} res - The response returned by the method.
  * @param {object} next - the returned values going into the next operation.
  * @return {object} - next().
  */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // decodes token id
      const decoded = jwt.verify(token, ''+process.env.SECRET);
      // const {id} = decoded;

      req.user = await findUserBy(decoded.id);

      next();
    } catch (err) {
      const status = err.status || 500;
      errorResponse(res, {code: status, message: err.message});
    }
  }

  if (!token) {
    res.status(401);
    throw new ApiError('Not authorized, no token');
  }
};

/**
  * Middleware method for user authentication
  * @param {object} req - The request from the endpoint.
  * @param {object} res - The response returned by the method.
  * @param {object} next - the returned values going into the next operation.
  * @param {object} roles - the JSON of the user profile containiig their roles.
  * @return {object} - next().
  */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
          new ApiError(
              `Role: ${req.user.role} is not allowed to access this resouce `,
              403,
          ),
      );
    }

    next();
  };
};

