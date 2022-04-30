import Joi from 'joi';

import ApiError from '../utils/apiError';

/**
 * Validates donation parameters upon registration
 *
 * @param {object} review The donation object
 * @return {boolean} returns true/false.
 */
export const validateDonation = async (review) => {
  // Joi parameters to test against user inputs
  const schema = Joi.object({
    // eslint-disable-next-line max-len
    amount: Joi.number().required().label('Please indicate how much you want to invest in this campaign.'),
    campaignId: Joi.number(),
    userId: Joi.number(),
  });
  const {error} = await schema.validateAsync(review);
  if (error) {
    throw new ApiError(400, error.message);
  }
  return true;
};
