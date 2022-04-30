import db from '../database/models';
// import ApiError from '../utils/apiError';

const {WalletTransaction} = db;

/**
 * Adds wallet transaction to the database
 * @param {object} data The wallet transaction to be added to the database.
 * @memberof WalletTransactionService
 * @return {Promise<WalletTransaction>} A promise object with wallet transaction
 *  details.
 */
export const addWalletTransaction = async (data) => {
//   const user = findWalletTransactionBy({id: business.userId});
//   if (!user) {
  // throw new ApiError(404, `WalletTransaction with id: ${id}
//    does not exist`);
//   }
  const newWalletTransaction = await WalletTransaction.create(data);

  return newWalletTransaction.dataValues;
};
