import db from '../database/models';
import ApiError from '../utils/apiError';
import {hashPassword} from '../utils/helpers';

const {User} = db;

/**
 * Adds user to the database
 * @param {object} user The user to be added to the database.
 * @memberof UserService
 * @return {Promise<User>} A promise object with user detail.
 */
export const createUser = async (user) => {
  // TODO: move the next line to a middleware
  user.password = await hashPassword(user.password);
  const newUser = await User.create(user);

  return newUser.dataValues;
};


/**
 *
 * updates an existing user by ID
 * @param {object} userData user properties to be updated
 * @param {number} id user id
 * @memberof UserService
 */
export const updateById = async (userData, id) => {
  const user = await findUserBy({id: id});

  if (!user) throw new ApiError(404, `User with id: ${id} does not exist`);

  return await user.update(userData);
};

/**
 * Finds user in the database
 *
 * @param {object} options An object containing query options
 * @return {Promise<User>} A promise object with user detail if user exists.
 */
export const findUserBy = async (options) => {
  return await User.findOne({where: options});
};


/**
 * Update user password in the database
 *
 * @param {string} password New password to be updated in database
 * @param {string} email The user's email
 * @return {Promis<User>} A promise object with user detail.
 */
export const updatePassword = async (password, email) => {
  const user = await findUserBy({email: email});
  if (!user) {
    throw new ApiError(404, `User with email: ${email} does not exist`);
  }
  // TODO: move the next line to a middleware
  const hashedPassword = hashPassword(password);
  return await user.update({password: hashedPassword});
};

/**
 * Function for update query
 *
 * @param {object} newValues Object of fields to be updated
 * @param {object} obj An object of the keys to be searched e.g {id}, {email}
 * @memberof UserService
 * @return {Promise<User>} A promise object with user detail.
 */
export const updateAny = async (newValues, obj) => {
  const user = await findUserBy(obj);
  if (!user) {
    throw new ApiError(404, `User with ${obj} does not exist`);
  }

  return await user.update(newValues);
};

/**
 * Function for update query
 *
*@param {object} newValues Object of fields to be updated
*@param {object} obj An object of the keys to be
 * searched e.g {id}, {productEmail}
 * @memberof UserService
 * @return {Promise<User>} A promise object with user detail.
 */
export const updateUserBy = async (newValues, obj) => {
  const user = await findUserBy(obj);
  if (!user) {
    throw new ApiError(404, `User with ${obj} does not exist`);
  }

  return await user.update(newValues);
};

/**
 * Function fetching user profile
 *
 * @param {userId} userId A user id
 * @memberof UserService
 * @return {Promise<User>} A promise object with user and business
 * detail if any.
 */
export const getProfile = async (userId) => {
  const user = await User.findOne(
      {where: {
        id: userId,
      },
      include: 'Business',
      });
  if (!user) {
    throw new ApiError(404, `User with ${userId} does not exist`);
  }

  return user.dataValues;
};


/**
 * Deletes a user record from the database.
 * @param {number} userId - id of user to be deleted from the database.
 * @return {Promise<object>} - A promise object which resolves
 * to the newly created user.
 * @memberof UserService
 */
export const deleteUserById= (userId) => {
  return User.destroy({where: {id: userId}});
};

/**
 * Fetches all users
 * @return {Promise<array>} - An instance of notification
 *  table including it's relationships.
 * @memberof UserService
 */
export const fetchAllUsers = async () => {
  const users = await User.findAll({});
  return users;
};

/**
 * Find all users matching the query
 * @param {number | object | string} options - User search value
 * @return {Promise<object>} A promise object with user detail.
 * @memberof UserService
 */
export const findUsersBy = async (options) => {
  return User.findAll({where: options});
};
