/* eslint-disable max-len */
import {generateToken, successResponse, errorResponse,
  comparePassword, extractUserData, verifyToken,
  getResetPasswordToken}
  from '../utils/helpers';
import {createUser, getProfile, findUserBy, updateById,
  updateAny, updatePassword}
  from '../services';
import ApiError from '../utils/apiError';
import {
  sendVerificationEmail, sendResetMail, sendEmail,
} from '../utils/mailer';
import crypto from 'crypto';
const {Op} = require('sequelize');

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
    const isSent = await sendVerificationEmail(req, {...user});
    successResponse(res, {...user, emailSent: isSent}, 201);
  } catch (error) {
    return errorResponse(res, {
      message: error.message,
      code: error.code,
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
    const url = `http(s)://gaged.io/password/update?token=${token}`;
    const response = await sendResetMail({
      email, firstName, resetPasswordLink: url,
    });
    if (!response) {
      throw new ApiError(404, response);
    }

    // eslint-disable-next-line max-len
    return successResponse(res, {message: 'Password reset link sent successfully'}, 200);
  } catch (err) {
    return errorResponse(res, {code: err.status, message: err.message});
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
export const autoResetPassword = async (req, res) => {
  try {
    const {password, email} = req.body;
    const {token} = req.params;
    const [updatedPassword] = await updatePassword(password, email);
    const verifiedToken = verifyToken(token);
    if (!updatedPassword || !verifiedToken) {
      throw new ApiError(404, 'User account does not exist');
    }

    return successResponse(res, {message: 'Password has been changed successfully'}, 200);
  } catch (err) {
    return errorResponse(res, {code: err.status, message: err.message});
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
  let token;
  if (
    req.headers.authorization &&
  req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      // decodes token id
      const decoded = jwt.verify(token, ''+process.env.SECRET);
      const user = await updateById({isVerified: true}, decoded.id);
      const userResponse = extractUserData(user);
      return successResponse(res, {...userResponse}, 200);
    } catch (e) {
      if (e.message === 'Invalid Token') {
        return errorResponse(res,
            {code: 400, message: 'Invalid token, verification unsuccessful'});
      }
      if (e.message === 'Not Found') {
        return errorResponse(res, {code: 400, message:
      'No user found to verify'});
      }
      return errorResponse(res, {message: e.message, code: e.status});
    }
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
      throw new ApiError(401, 'Password and email combination is invalid');
    }

    if (!comparePassword(password, user.password)) {
      throw new ApiError(401, 'Password and email combination is invalid');
    }
    user.token =
    generateToken({email: user.email});
    const loginResponse = extractUserData(user);
    const {token} = loginResponse;
    res.cookie('token', token, {maxAge: 86400000, httpOnly: true});
    successResponse(res, {...loginResponse});
  } catch (error) {
    errorResponse(res, {code: error.status, message: error.message});
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
    // eslint-disable-next-line max-len
    return successResponse(res, {message: 'You have been successfully logged out'}, 200);
  } catch (error) {
    return errorResponse(res, {message: error.message, code: error.status});
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
export const getMyDetails = async (req, res, next) => {
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


/**
 *
 *  Forgot Password
 * @static
 * @param {Request} req - The request from the endpoint.
 * @param {Response} res - The response returned by the method.
 * @param {Response} next - The response returned by the method.
 * @memberof Auth
 */
export const forgotPassword = async (req, res, next) => {
  const user = await findUserBy({email: req.body.email});

  if (!user) {
    throw new ApiError('User not found', 404);
  }

  // Get ResetPassword Token
  const resetToken = getResetPasswordToken(user);

  await updateAny({resetPasswordToken: resetToken}, {id: user.id});

  const resetPasswordUrl = `${req.protocol}://${req.get(
      'host',
  )}/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Gaged Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    await updateAny({resetPasswordToken: undefined, resetPasswordExpire: undefined}, {id: user.id});

    throw new ApiError(error.message, 500);
  }
};

// Reset Password
/**
 *
 *  Reset Password
 * @static
 * @param {Request} req - The request from the endpoint.
 * @param {Response} res - The response returned by the method.
 * @param {Response} next - The response returned by the method.
 * @memberof Auth
 */
export const resetPassword = async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

  const user = await findUserBy({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: {[Op.gt]: Date.now()},
  });

  if (!user) {
    throw new ApiError(
        'Reset Password Token is invalid or has been expired',
        400,
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    throw new ApiError('Password does not match', 400);
  }

  await updateAny({resetPasswordToken: undefined, resetPasswordExpire: undefined, password: req.body.password}, {id: user.id});
  // await updateAny({password: req.body.password}, {id: user.id});

  sendToken(user, 200, res);
};

/**
 *
 *  Update password
 * @static
 * @param {Request} req - The request from the endpoint.
 * @param {Response} res - The response returned by the method.
 * @param {Response} next - The response returned by the method.
 * @memberof Auth
 */
export const updatePasswordOne = async (req, res, next) => {
  const user = await findUserBy(req.user.id).select('+password');

  const isPasswordMatched = await comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    throw new ApiError('Old password is incorrect', 400);
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    throw new ApiError('password does not match', 400);
  }
  await updateAny({password: req.body.newPassword}, {id: req.user.id});

  sendToken(user, 200, res);
};
