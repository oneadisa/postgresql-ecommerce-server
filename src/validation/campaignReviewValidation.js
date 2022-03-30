import Joi from 'joi';

import ApiError from '../utils/apiError';

/**
 * Validates campaign review parameters upon registration
 *
 * @param {object} review The campaign review object
 * @return {boolean} returns true/false.
 */
export const validateCampaignReview = async (review) => {
  // Joi parameters to test against user inputs
  const schema = Joi.object({
    // eslint-disable-next-line max-len
    comment: Joi.string().required().label('Please enter a comment for your campaign review.'),
    campaignId: Joi.number(),
    userId: Joi.number(),
  });
  const {error} = await schema.validateAsync(review);
  if (error) {
    throw new ApiError(400, error.message);
  }
  return true;
};
