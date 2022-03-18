import {successResponse, errorResponse} from '../utils/helpers';

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
    const users = await User.find();

    res.status(200).json({
      success: true,
      users,
    });

    successResponse(res, {...users}, 201);
  } catch (error) {
    errorResponse(res, {
      message: error.message,
    });
  }
};

/**
 * Get single user
 *
 * @param {Request} req The request from the endpoint.
 * @param {Response} res The response returned by the method.
 * @param {Response} next The response returned by the method.
 * @memberof UserController
 * @return {JSON} A JSON response with the registered user's details and a JWT.
 */
export const getSingleUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(
          new ErrorHander(`User does not exist with Id: ${req.params.id}`),
      );
    }

    res.status(200).json({
      success: true,
      user,
    });

    successResponse(res, {...users}, 201);
  } catch (error) {
    errorResponse(res, {
      message: error.message,
    });
  }
};

