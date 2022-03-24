import Joi from 'joi';

import ApiError from '../utils/apiError';

/**
 * Validates store parameters upon registration
 *
 * @param {object} store The store object
 * @return {boolean} returns true/false.
 */
export const validateStore = async (store) => {
  // Joi parameters to test against user inputs
  const schema = Joi.object({
    storeName: Joi.string().alphanum().required()
        .label('Please enter a name for your store.'),
    storeTagline: Joi.string().alphanum().required()
        .label('Please provide a tagline for your store.'),
    storeDescription: Joi.string().required()
        .label('Please provide a brief description of your store.'),
    storeLink: Joi.string().required()
        .label('Please provide a link for your store.'),
    category: Joi.string()
        // .valid('LLC', 'sole proprietorship', 'unregistered')
        .required()
        .label('Please provide a category for your store.'),
    storeLogo: Joi.string(),
    storeBackground: Joi.string(),
    businessId: Joi.number(),
    userId: Joi.number(),
  });
  const {error} = await schema.validateAsync(store);
  if (error) {
    throw new ApiError(400, error.message);
  }
  return true;
};
