import {findUserBy} from './';
import db from '../database/models';
import ApiError from '../utils/apiError';
// import sequelize from 'sequelize';
const {Payout} = db;

/**
 * Adds payout to the database
 * @param {object} payout The payout to be added to the database.
 * @memberof PayoutService
 * @return {Promise<Payout>} A promise object with payout detail.
 */
export const createPayout = async (payout) => {
  const user = findUserBy({id: payout.userId});
  if (!user) throw new ApiError(404, `User with id: ${id} does not exist`);
  const newPayout = await Payout.create(payout);

  return newPayout.dataValues;
};

/**
 *
 * updates an existing payout by ID
 * @param {object} donationData payout properties to be updated
 * @param {number} id payout id
 * @memberof PayoutService
 */
export const updatePayoutById = async (donationData, id) => {
  const payout = await findPayoutBy({id: id});

  if (!payout) {
    throw new ApiError(404,
        `Payout with id: ${id} does not exist`);
  }

  return await payout.update(donationData);
};

/**
 * Finds payout in the database
 *
 * @param {object} options An object containing query options
 * @return {Promise<Payout>} A promise object with payout
 * detail if payout exists.
 */
export const findPayoutBy = async (options) => {
  return await Payout.findOne({where: options});
};

/**
 * Find all product reviews given a query
 * @param {number | object | string} options - Payout search value
 * @return {Promise<object>} A promise object with user detail.
 * @memberof PayoutService
 */
export const findPayoutsBy = async (options) => {
  return Payout.findAll({where: options});
};


/**
   * Find all product reviews given a query
   * @param {number | object | string} options - Payout search value
   * @return {Promise<object>} A promise object with user detail.
   * @memberof PayoutService
   */
export const findPayoutsSum = async (options) => {
  return await Payout.sum('amount', {where: options});
};

/**
   * Find sum to be repaid from all campaigns that match
   * @param {number | object | string} options - Payout search value
   * @return {Promise<object>} A promise object with user detail.
   * @memberof PayoutService
   */
// export const findDebtSum = async (options) => {
// const amount = await Payout.sum('amountToBeRepaid', {where: options});
//
// return amount;
// };


/**
 * Fetches all donations
 * @return {Promise<array>} - An instance of notification
 *  table including it's relationships.
 * @memberof PayoutService
 */
export const fetchAllPayouts = async () => {
  const donations = await Payout.findAll({});
  return donations;
};

/**
 * Find all donations given a query and give count
 * @param {number | object | string} options - Payout search value
 * @return {Promise<object>} A promise object with user detail.
 * @memberof PayoutService
 */
export const findPayoutsAndCountBy = async (options) => {
  return await Payout.findAndCountAll({where: options});
};

/**
 * Function for update query
 *
*@param {object} newValues Object of fields to be updated
*@param {object} obj An object of the keys to be
 * searched e.g {id}, {donationEmail}
 * @memberof PayoutService
 * @return {Promise<Payout>} A promise object with payout detail.
 */
export const updatePayoutBy = async (newValues, obj) => {
  const payout = await findPayoutBy(obj);
  if (!payout) {
    throw new ApiError(404, `Payout with ${obj} does not exist`);
  }

  return await payout.update(newValues);
};

/**
 * Deletes a payout record from the database.
 * @param {number} donationId - id of payout to be deleted from the database.
 * @return {Promise<object>} - A promise object which resolves
 * to the newly created payout.
 * @memberof PayoutService
 */
export const deletePayoutById = (donationId) => {
  return Payout.destroy({where: {id: donationId}});
};
