// import {findWalletBy} from './';
import db from '../database/models';
import ApiError from '../utils/apiError';

const {Wallet} = db;

/**
 * Adds business to the database
 * @param {object} data The business to be added to the database.
 * @memberof WalletService
 * @return {Promise<Wallet>} A promise object with business detail.
 */
export const createWallet = async (data) => {
//   const user = findWalletBy({id: business.userId});
//   if (!user) throw new ApiError(404, `Wallet with id: ${id} does not exist`);
  const newWallet = await Wallet.create(data);

  return newWallet.dataValues;
};

/**
 *
 * updates an existing business by ID
 * @param {object} businessData business properties to be updated
 * @param {number} id business id
 * @memberof WalletService
 */
export const updateWalletById = async (businessData, id) => {
  const business = await findWalletBy({id: id});

  if (!business) {
    throw new ApiError(404,
        `Wallet with id: ${id} does not exist`);
  }

  return await business.update(businessData);
};

/**
 * Fetches all businesses
 * @return {Promise<array>} - An instance of notification
 *  table including it's relationships.
 * @memberof WalletService
 */
export const fetchAllWalletess = async () => {
  const businesses = await Wallet.findAll({});
  return businesses;
};

/**
 * Finds wallet in the database
 *
 * @param {object} options An object containing query options
 * @return {Promise<Wallet>} A promise object with business
 * detail if business exists.
 */
export const findWalletBy = async (options) => {
  return await Wallet.findOne({where: options});
};

/**
 * Function for update query
 *
*@param {object} newValues Object of fields to be updated
*@param {object} obj An object of the keys to be
 * searched e.g {id}, {businessEmail}
 * @memberof WalletService
 * @return {Promise<Wallet>} A promise object with business detail.
 */
export const updateWalletBy = async (newValues, obj) => {
  const business = await findWalletBy(obj);
  if (!business) {
    throw new ApiError(404, `Wallet with ${obj} does not exist`);
  }

  return await business.update(newValues);
};

/**
 * Deletes a business record from the database.
 * @param {number} businessId - id of business to be deleted from the database.
 * @return {Promise<object>} - A promise object which resolves
 * to the newly created business.
 * @memberof WalletService
 */
export const deleteWalletById = (businessId) => {
  return Wallet.destroy({where: {id: businessId}});
};
