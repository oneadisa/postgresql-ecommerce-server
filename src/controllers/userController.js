import {successResponse, errorResponse, extractUserData}
  from '../utils/helpers';
import {findUserBy, updateAny, deleteUserById}
  from '../services';
import db from '../database/models';
const {User} = db;

/**
 * Get all users
 *
 * @param {Request} req The request from the endpoint.
 * @param {Response} res The response returned by the method.
 * @param {Response} next The response returned by the method.
 * @memberof UserController
 * @return {JSON} A JSON response with the registered user's details and a JWT.
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const {count, rows} = await User.findAndCountAll({});

    return res.status(200).json({
      success: true,
      count,
      rows,
    });

    // successResponse(res, {...rows}, count, 201);
  } catch (error) {
    errorResponse(res, {
      message: error.message,
    });
  }
};

/**
  * Gets a user profile after registeration or sign-in.
  *
  * @static
  * @param {Request} req - The request from the endpoint.
  * @param {Response} res - The response returned by the method.
  * @return { JSON } A JSON response with the user's profile details.
  * @memberof UserController
  */
export const userProfile = async (req, res) => {
  try {
    const id = req.params.userId;
    const user = await findUserBy({id});
    const userResponse = extractUserData(user);
    successResponse(res, userResponse, 200);
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};

/**
 * Updates a user profile (admin)
 *

 * @param {Request} req - The request from the endpoint.
 * @param {Response} res - The response returned by the method.
 * @return { JSON } A JSON response with the new user's profile update.
 * @memberof UserController
 */
export const updateProfile= async (req, res) => {
  try {
    const id = req.params.userId;
    const user = await updateAny(req.body, {id});
    const userResponse = extractUserData(user);
    successResponse(res, userResponse, 200);
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};

/**
 * Updates a user profile.
 *

 * @param {Request} req - The request from the endpoint.
 * @param {Response} res - The response returned by the method.
 * @return { JSON } A JSON response with the new user's profile update.
 * @memberof UserController
 */
export const updateMyProfile= async (req, res) => {
  try {
    const id = req.user.id;
    const user = await updateAny(req.body, {id});
    const userResponse = extractUserData(user);
    successResponse(res, userResponse, 200);
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};


/**
  * Deletes a user on a travel request.
  *
  * @param {Request} req - The request from the endpoint.
  * @param {Response} res - The response returned by the method.
  * @return { JSON } A JSON response containing with an empty data object.
  * @memberof UserController
  */
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const rowDeleted = await deleteUserById(userId);
    if (!rowDeleted) return errorResponse(res, {});
    successResponse(res, {id: userId}, 200);
  } catch (err) {
    errorResponse(res, {});
  }
};

/**
  * Deletes a user on a travel request.
  *
  * @param {Request} req - The request from the endpoint.
  * @param {Response} res - The response returned by the method.
  * @return { JSON } A JSON response containing with an empty data object.
  * @memberof UserController
  */
export const deleteMyAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const rowDeleted = await deleteUserById(userId);
    if (!rowDeleted) return errorResponse(res, {});
    successResponse(res, {code: 200, message:
       'Account Deleted Successfully.'}, 200);
  } catch (err) {
    errorResponse(res, {});
  }
};
