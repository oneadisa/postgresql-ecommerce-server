import {generateToken, successResponse, errorResponse,
  comparePassword, extractUserData, verifyToken}
  from '../utils/helpers';
import {createUser, getProfile, findUserBy, updateById, updatePassword}
  from '../services';
import ApiError from '../utils/apiError';
/**
 * Registers a new user.
 *
 * @param {Request} req The request from the endpoint.
 * @param {Response} res The response returned by the method.
 * @memberof AuthController
 * @return {JSON} A JSON response with the registered user's details and a JWT.
 */
export const userSignup = async (req, res) => {
  try {
    const {body} = req;
    const user = await createUser(body);
    user.token = generateToken({email: user.email});
    // TODO: delete password field
    // user = extractUserData(user);
    const {token} = user;
    res.cookie('token', token, {maxAge: 86400000, httpOnly: true});

    successResponse(res, {...user}, 201);
  } catch (error) {
    errorResponse(res, {
      message: error.message,
    });
  }
};

/**
 * Registers a new user.
 *
 * @param {Request} req The request from the endpoint.
 * @param {Response} res The response returned by the method.
 * @memberof AuthController
 * @return {JSON} A JSON response with the registered user's details and a JWT.
 */
export const getUserProfile = async (req, res) => {
  try {
    const {userId} = req.params;
    // const validated = validateProfileRequest(parseInt(userId));
    // if (validated) {
    const profile = await getProfile(userId);

    successResponse(res, {...profile}, 200);
    // }
  } catch (error) {
    errorResponse(res, {
      message: error.message,
    });
  }
};

/**
 * Sends a user reset password link
 *
 * @param {Request} req - The request from the endpoint.
 * @param {Response} res - The response returned by the method.
 * @return {JSON} A JSON response with a successfully message.
 * @memberof Auth
 */
export const sendResetPasswordEmail= async (req, res) => {
  try {
    const {email} = req.body;
    const user = await findUserBy({email});
    if (!user) {
      throw new ApiError(404, 'User account does not exist');
    }
    const {firstName, id} = user;
    const token = generateToken({firstName, id, email}, '24h');
    const url = `${req.protocol}://${req.get('host')}/api/auth/reset-password?token=${token}`;
    const response = await sendResetMail({
      email, firstName, resetPasswordLink: url,
    });
    if (response === true) {
      successResponse(res, 'Password reset link sent successfully', 200);
    } else {
      throw new ApiError(404, response);
    }
  } catch (err) {
    const status = err.status || 500;
    errorResponse(res, {code: status, message: err.message});
  }
};
/**
 * Gets user new password object from the request and saves it in the database
 *
 * @param {Request} req - The request from the endpoint.
 * @param {Response} res - The response returned by the method.
 * @return {JSON} A JSON response with the registered user and a JWT.
 * @memberof Auth
 */
export const resetPassword= async (req, res) =>{
  try {
    const {password} = req.body;
    const {email} = req.params;
    const [updatedPassword] = await updatePassword(password, email);
    if (updatedPassword === 1) {
      successResponse(res, 'Password has been changed successfully', 200);
    } else {
      throw new ApiError(404, 'User account does not exist');
    }
  } catch (err) {
    const status = err.status || 500;
    errorResponse(res, {code: status, message: err.message});
  }
};
/**
 * Verify password reset link token
 *
 * @param {Request} req - The request from the endpoint.
 * @param {Response} res - The response returned by the method.
 * @memberof Auth
 */
export const verifyPasswordResetLink = (req, res) => {
  try {
    const {token} = req.query;
    const {email} = verifyToken(token);
    const url = `${req.protocol}s://${req.get('host')}/api/auth/password/reset/${email}`;
    successResponse(res,
        `Goto ${url} using POST Method with body 'password':
         'newpassword' and 'confirmPassword': 'newpassword'`,
        200);
  } catch (err) {
    const status = err.status || 500;
    errorResponse(res, {code: status, message: `Verification unsuccessful, 
    ${err.message}`});
  }
};

/**
 *
 *  verifies user's email address
 * @static
 * @param {Request} req - The request from the endpoint.
 * @param {Response} res - The response returned by the method.
 * @memberof Auth
 */
export const verifyEmail= async (req, res) =>{
  try {
    const {token} = req.cookies;
    const decoded = verifyToken(token);
    const user = await updateById({isVerified: true}, decoded.id);
    const userResponse = extractUserData(user);
    successResponse(res, {...userResponse});
  } catch (e) {
    if (e.message === 'Invalid Token') {
      return errorResponse(res,
          {code: 400, message: 'Invalid token, verification unsuccessful'});
    }
    if (e.message === 'Not Found') {
      return errorResponse(res, {code: 400, message:
        'No user found to verify'});
    }
    errorResponse(res, {});
  }
};

/**
*  Login an existing user
*
* @param {object} req request object
* @param {object} res reponse object
* @return {object} JSON response
*/
export const loginUser= async (req, res) =>{
  try {
    const {email, password} = req.body;
    const user = await findUserBy({email});
    if (!user) {
      return errorResponse(res, {code: 401, message:
         'Please provide a valid email.'});
    }
    if (!comparePassword(password, user.password)) {
      return errorResponse(res, {code: 401, message: 'Invalid password'});
    }
    user.token =
    generateToken({email: user.email});
    const loginResponse = extractUserData(user);
    const {token} = loginResponse;
    res.cookie('token', token, {maxAge: 86400000, httpOnly: true});
    successResponse(res, {...loginResponse});
  } catch (error) {
    errorResponse(res, {});
  }
};
/**
 *  successfully logout a user
 * @static
 * @param {Request} req - The request from the endpoint.
 * @param {Response} res - The response returned by the method.
 * @return { JSON } - A JSON object containing success or failure details.
 * @memberof Auth
 */
export const logout = async (req, res) =>{
  try {
    res.clearCookie('token', {httpOnly: true});
    res.cookie('token', null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    return successResponse(res,
        {code: 200, message: 'You have been successfully logged out'});
  } catch (error) {
    errorResponse(res, {message: error.message});
  }
};


/**
 *
 *  Get profile details
 * @static
 * @param {Request} req - The request from the endpoint.
 * @param {Response} res - The response returned by the method.
 * @param {Response} next - The response returned by the method.
 * @memberof Auth
 */
export const getUserDetails = async (req, res, next) => {
  try {
    const user = await findUserBy({id: req.user.id});
    if (!user) {
      return errorResponse(res, {code: 401, message:
        'This user does not exist or is logged out. Please login or sign up.'});
    }
    // user.token =
    // generateToken({email: user.email});
    const loginResponse = extractUserData(user);
    // const {token} = loginResponse;
    // res.cookie('token', token, {maxAge: 86400000, httpOnly: true});
    successResponse(res, {...loginResponse});
  } catch (error) {
    errorResponse(res, {});
  }
};

