import Joi from 'joi';

import ApiError from '../utils/apiError';

/**
 * Validates product parameters upon registration
 *
 * @param {object} product The product object
 * @return {boolean} returns true/false.
 */
export const validateProduct = async (product) => {
  // Joi parameters to test against user inputs
  const schema = Joi.object({
    productTitle: Joi.string().required()
        .label('Please enter a title for your product.'),
    shortDescription: Joi.string().required()
        .label('Please provide a brief description of your product.'),
    productDetails: Joi.string().required()
        .label('Please provide details about your product.'),
    discountedPrice: Joi.number().required()
        .label('Please provide a discounted rice for your product.'),
    price: Joi.number().required()
        .label('Please provide a price for your product.'),
    productUnitCount: Joi.number().required()
        .label('Please provide a unit count for your product.'),
    deliveryPrice: Joi.number().required()
        .label('Please provide a delivery price for your product.'),
    numberOfReviews: Joi.number(),
    ratings: Joi.number(),
    category: Joi.string()
        // .valid('LLC', 'sole proprietorship', 'unregistered')
        .required()
        .label('Please provide a category for your product.'),
    storeId: Joi.number(),
    images: Joi.array(),
    userId: Joi.number(),
  });
  const {error} = await schema.validateAsync(product);
  if (error) {
    throw new ApiError(400, error.message);
  }
  return true;
};
