import Joi from 'joi';

import ApiError from '../utils/apiError';

/**
 * Validates walletTransfer parameters upon registration
 *
 * @param {object} walletTransfer The walletTransfer object
 * @return {boolean} returns true/false.
 */
export const validateWalletTransfer = async (walletTransfer) => {
  // Joi parameters to test against user inputs
  const schema = Joi.object({
    trnxType: Joi.string(),
    amount: Joi.number().required(),
    balanceBefore: Joi.number(),
    balanceAfter: Joi.number,
    summary: Joi.string(),
    trnxSummary: Joi.string(),
    userId: Joi.number(),
  });
  const {error} = await schema.validateAsync(walletTransfer);
  if (error) {
    throw new ApiError(400, error.message);
  }
  return true;
};
