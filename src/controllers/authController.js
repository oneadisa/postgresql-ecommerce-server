import {generateToken, successResponse, errorResponse} from '../utils/helpers';
import {createUser, getProfile} from '../services/userService';

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
    const user = await find({email});
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
    const {token} = req.query;
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
    const user = await find({email});
    if (!user) {
      return errorResponse(res, {code: 401, message: 'Invalid login details'});
    }
    if (!comparePassword(password, user.password)) {
      return errorResponse(res, {code: 401, message: 'Invalid login details'});
    }
    user.token =
    generateToken({email: user.email, id: user.id, role: user.role});
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
    return successResponse(res,
        {code: 200, message: 'You have been successfully logged out'});
  } catch (error) {
    errorResponse(res, {message: error.message});
  }
};


/**
 *
 *  forgot password
 * @static
 * @param {Request} req - The request from the endpoint.
 * @param {Response} res - The response returned by the method.
 * @param {Response} next - The response returned by the method.
 * @return { JSON } - A JSON object containing success or failure details.
 * @memberof Auth
 */
export const forgotPassword = async (req, res, next) => {
  const user = await User.findOne({email: req.body.email});

  if (!user) {
    return next(new ErrorHander('User not found', 404));
  }

  /**
 *
 *  Get reset token
 * @static
 * @param {Request} req - The request from the endpoint.
 * @param {Response} res - The response returned by the method.
 * @return { JSON } - A JSON object containing success or failure details.
 * @memberof Auth
 */
  const resetToken = user.getResetPasswordToken();

  await user.save({validateBeforeSave: false});

  const resetPasswordUrl = `${req.protocol}://${req.get(
      'host',
  )}/password/reset/${resetToken}`;

  const message = `Your password reset token is :-
   \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then,
    please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({validateBeforeSave: false});

    return next(new ErrorHander(error.message, 500));
  }
};

/**
 *
 *  Reset password token
 * @static
 * @param {Request} req - The request from the endpoint.
 * @param {Response} res - The response returned by the method.
 * @param {Response} next - The response returned by the method.
 * @memberof Auth
 */
export const resetPasswordToken = async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {$gt: Date.now()},
  });

  if (!user) {
    return next(
        new ErrorHander(
            'Reset Password Token is invalid or has been expired',
            400,
        ),
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHander('Password does not password', 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
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
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
};

/**
 *
 *  forgot password
 * @static
 * @param {Request} req - The request from the endpoint.
 * @param {Response} res - The response returned by the method.
 * @param {Response} next - The response returned by the method.
 * @memberof Auth
 */
export const updatePassword = async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHander('Old password is incorrect', 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHander('password does not match', 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
};

/**
 *
 *  forgot password
 * @static
 * @param {Request} req - The request from the endpoint.
 * @param {Response} res - The response returned by the method.
 * @param {Response} next - The response returned by the method.
 * @memberof Auth
 */
export const updateProfile = async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.body.avatar !== '') {
    const user = await User.findById(req.user.id);

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: 'avatars',
      width: 150,
      crop: 'scale',
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
};
