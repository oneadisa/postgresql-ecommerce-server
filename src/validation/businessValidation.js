import Joi from 'joi';

import ApiError from '../utils/apiError';

/**
 * Validates business parameters upon registration
 *
 * @param {object} business The business object
 * @return {boolean} returns true/false.
 */
export const validateBusiness = async (business) => {
  // Joi parameters to test against user inputs
  const schema = Joi.object({
    businessName: Joi.string().alphanum().required()
        .label('Please enter a valid businessName'),
    natureOfBusiness: Joi.string().alphanum().required()
        .label('Please provide a valid nature of business'),
    businessEmail: Joi.string().email().required()
        .label('Please entere a valid email address'),
    businessAddress: Joi.string().required()
        .label('Please enter a valid address'),
    businessType: Joi.string()
        .valid('LLC', 'sole proprietorship', 'unregistered')
        .required()
        .label('Please enter a business type between (LLC, sole' +
        ' proprietorship, unregistered)'),
    cacCertURL: Joi.string(),
    userId: Joi.number(),
  });
  const {error} = await schema.validateAsync(business);
  if (error) {
    throw new ApiError(400, error.message);
  }
  return true;
};
