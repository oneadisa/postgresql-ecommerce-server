import Joi from 'joi';

import ApiError from '../utils/apiError';

/**
 * Validates product review parameters upon registration
 *
 * @param {object} review The product review object
 * @return {boolean} returns true/false.
 */
export const validateProductReview = async (review) => {
  // Joi parameters to test against user inputs
  const schema = Joi.object({
    comment: Joi.string(),
    rating: Joi.number(),
    productId: Joi.number(),
    userId: Joi.number(),
  });
  const {error} = await schema.validateAsync(review);
  if (error) {
    throw new ApiError(400, error.message);
  }
  return true;
};
