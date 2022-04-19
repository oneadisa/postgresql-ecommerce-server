import Joi from 'joi';

import ApiError from '../utils/apiError';

/**
 * Validates walletTransaction parameters upon registration
 *
 * @param {object} walletTransaction The walletTransaction object
 * @return {boolean} returns true/false.
 */
export const validateWalletTransaction = async (walletTransaction) => {
  // Joi parameters to test against user inputs
  const schema = Joi.object({
    amount: Joi.string().required()
        .label('Please enter an amount for your transaction.'),
    userId: Joi.number(),
    isInflow: Joi.boolean(),
    paymentMethod: Joi.string().required()
        .label('Please choose a payment method for your transaction.'),
    currency: Joi.string(),
    balanceBefore: Joi.number(),
    balanceAfter: Joi.number,
    status: Joi.string(),
  });
  const {error} = await schema.validateAsync(walletTransaction);
  if (error) {
    throw new ApiError(400, error.message);
  }
  return true;
};
