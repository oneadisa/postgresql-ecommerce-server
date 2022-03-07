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
