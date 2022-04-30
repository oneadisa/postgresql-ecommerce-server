import Joi from 'joi';

import ApiError from '../utils/apiError';

/**
 * Validates transaction parameters upon registration
 *
 * @param {object} transaction The transaction object
 * @return {boolean} returns true/false.
 */
export const validateTransaction = async (transaction) => {
  // Joi parameters to test against user inputs
  const schema = Joi.object({
    amount: Joi.string().required()
        .label('Please enter an amount for your transaction.'),
    userId: Joi.number(),
    isInflow: Joi.boolean(),
    paymentMethod: Joi.string().required()
        .label('Please choose a payment method for your transaction.'),
    currency: Joi.string(),
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
    currency: Joi.string(),
    paymentGateway: Joi.string(),
    paymentStatus: Joi.string(),
    balanceBefore: Joi.number(),
    balanceAfter: Joi.number,
    status: Joi.string(),
  });
  const {error} = await schema.validateAsync(transaction);
  if (error) {
    throw new ApiError(400, error.message);
  }
  return true;
};
