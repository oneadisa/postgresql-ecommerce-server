import db from '../database/models';
// import ApiError from '../utils/apiError';

const {Transaction} = db;

/**
 * Adds transaction to the database
 * @param {object} data The transaction to be added to the database.
 * @memberof TransactionService
 * @return {Promise<Transaction>} A promise object with wallet transaction
 *  details.
 */
export const addTransaction = async (data) => {
//   const user = findTransactionBy({id: business.userId});
//   if (!user) {
  // throw new ApiError(404, `Transaction with id: ${id}
//    does not exist`);
//   }
  const newTransaction = await Transaction.create(data);

  return newTransaction.dataValues;
};

/**
 * Finds transaction in the database
 *
 * @param {object} options An object containing query options
 * @return {Promise<Transaction>} A promise object with business
 * detail if business exists.
 */
export const findTransactionBy = async (options) => {
  return await Transaction.findOne({where: options});
};

