import jwt from 'jsonwebtoken';
// import Joi from '@hapi/joi';
import bcrypt from 'bcryptjs';
import env from '../config/env-config';
// import ApiError from './apiError';

const {SECRET, PORT} = env;


/**
 * Hashes a password
 * @param {string} password Password to encrypt.
 * @memberof Helpers
 * @return {Promise<string>} Encrypted password.
*/
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, bcrypt.genSaltSync(10));
};

/**
 * Compares a password with a given hash
 * @param {string} password Plain text password.
 * @param {string} hash Encrypted password.
 * @memberof Helpers
 * @return {boolean} returns true if there is a match and false otherwise.
*/
export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

/**
 *  Synchronously sign the given payload into a JSON Web Token string.
 * @param {string | number | Buffer | object} payLoad Payload to sign.
 * @param {string | number} expiresIn Expressed in seconds or a string
 * describing a time span. Eg: 60, "2 days", "10h", "7d". Default specified
 * is 1day.
 * @memberof Helpers
 * @return {string} JWT token.
 */
export const generateToken = (payLoad, expiresIn = '1d') => {
  return jwt.sign(payLoad, ''+ process.env.SECRET, {expiresIn});
};

/**
*  Synchronously sign the given payload into a JSON Web Token
*  string that never expires.
* @static
* @param {string | number | Buffer | object} payLoad Payload to sign.
* @memberof Helpers
* @return {string} JWT token.
*/
export const generateTokenAlive = (payLoad) => {
  return jwt.sign(payLoad, process.env.SECRET);
};

/**
 * Generates a JSON response for success scenarios.
 * @param {Response} res Response object.
 * @param {object} data The payload.
 * @param {number} code HTTP Status code.
 * @memberof Helpers
 * @return {Response} A JSON success response.
*/
export const successResponse = (res, data, code = 200) => {
  return res.status(code).json({
    status: 'success',
    data,
  });
};

/**
 * Generates a JSON response for failure scenarios.
 * @param {Response} res Response object.
 * @param {object} options The payload.
 * @param {number} options.code HTTP Status code, default is 500.
 * @param {string} options.message Error message.
 * @param {object} options.errors A collection of  error message.
 * @memberof Helpers
 * @return {Response} A JSON failure response.
*/
export const errorResponse = (res,
    {code = 500,
      message = 'Some error occurred while processing your Request',
      errors}) => {
  return res.status(code).json({
    status: 'fail',
    error: {
      message,
      errors,
    },
  });
};

/**
 *  Generates token upon first signup to be used by subesquent users
 * @param {string} letterIdentifier - one letter identifier of establishment.
 * @param {number} id - one letter identifier of establishment
 * @memberof Helpers
 * @return {string} JWT token.
 */
export const generateTokenOnSignup =(letterIdentifier, id) => {
  const randomNumber = Math.floor(Math.random() * 8999 + 1000);
  const anotherRandomNumber = Math.floor(Math.random() * 8999 + 1000);
  const token =
   `${letterIdentifier}.${id}.${randomNumber}@${anotherRandomNumber}`;
  return token;
};

/**
* Checks token from request header for user authentication
* @param {object} req - The request from the endpoint
* @memberof Helpers
* @return {Token} Token
*/
export const checkToken= async (req) => {
  const {
    headers: {authorization},
    cookies: {token: cookieToken},
  } = req;
  let bearerToken = null;
  if (authorization) {
    bearerToken = authorization.split(' ')[1] ?
      authorization.split(' ')[1] : authorization;
  }
  return cookieToken || bearerToken || req.headers['x-access-token'] ||
   req.headers.token || req.body.token;
};

/**
   *
   *  Synchronously verify the given JWT token using a secret
   * @param {*} token - JWT token.
   * @return {string | number | Buffer | object } - Decoded JWT payload if
   * token is valid or an error message if otherwise.
   * @memberof Helpers
   */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    throw new Error('Invalid Token');
  }
};

/**
   * Generates email verification link
   * @static
   * @param { Request } req - Request object
   * @param { object } options - Contains user's data to be signed within Token.
   * @param { string } options.id - User's unique ID.
   * @param { string } options.email - User's email.
   * @param { string } options.role - User's role.
   * @memberof Helpers
   * @return {URL} - Verification link.
   */
export const generateVerificationLink = (req, {id, email, role}) =>{
  const token = generateToken({id, email, role});
  const host = req.hostname === 'localhost' ? `${req.hostname}:${PORT}` :
  req.hostname;
  return `${req.protocol}://${host}/api/auth/verify?token=${token}`;
};


/**
* Extracts a new user object from the one supplied
* @param {object} user - The user data from which a new user
 object will be extracted.
* @memberof Helpers
* @return { object } - The new extracted user object.
*/
export const extractUserData = (user) => {
  return {
    id: user.id,
    isVerified: user.isVerified,
    token: user.token,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    accountType: user.accountType,
    role: user.role,
    gender: user.gender,
    phoneNumber: user.phoneNumber,
    avatar: user.avatar,
    meansOfID: user.meansOfID,
    IDpic: user.IDpic,
    bankCode: user.bankCode,
    bankAccountName: user.bankAccountName,
    bankAccountNumber: user.bankAccountNumber,
    walletBalance: user.walletBalance,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

/**
* Extracts a new business object from the one supplied
* @param {object} business - The user data from which a new business
 object will be extracted.
* @memberof Helpers
* @return { object } - The new extracted user object.
*/
export const extractBusinessData = (business) => {
  return {
    id: business.id,
    businessName: business.businessName,
    natureOfBusiness: business.natureOfBusiness,
    businessAddress: business.businessAddress,
    businessType: business.businessType,
    cacCertURL: business.cacCertURL,
    userId: business.userId,
    createdAt: business.createdAt,
    updatedAt: business.updatedAt,
  };
};
