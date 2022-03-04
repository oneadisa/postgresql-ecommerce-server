import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
  return jwt.sign(payLoad, process.env.SECRET, {expiresIn});
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
