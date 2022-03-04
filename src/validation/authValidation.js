import Joi from 'joi';

import ApiError from '../utils/apiError';

/**
 * Validates user paramenters upon registration
 *
 * @param {object} user The user object
 * @param {object} res The user response object
 * @return {object} returns an object (error or response).
*/
export const validateUserSignup = async (user) => {
  // Joi parameters to test against user inputs
  const schema = Joi.object({
    firstName: Joi.string().alphanum().min(3).max(25).required()
        .label('Please enter a valid firstname \n' +
        'the field must not be empty and it must be more than 2 letters'),
    lastName: Joi.string().alphanum().min(3).max(25).required()
        .label('Please enter a valid lastname \n'+
        'the field must not be empty and it must be more than 2 letters'),
    email: Joi.string().email().required()
        .label('Please enter a valid email address'),
    gender: Joi.string().valid('male', 'female')
        .label('please input a gender (male or female)'),
    phoneNumber: Joi.string().regex(/^[0-9+\(\)#\.\s\/ext-]+$/)
        .label('Please input a valid phone number'),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')).required()
        .label('Password is required. \n' +
        'It should be more than 8 characters,' +
        ' and should include at least a capital letter, and a number'),
    repeatPassword: Joi.ref('password'),
  })
      .with('password', 'repeatPassword');
  // Once user inputs are validated, move into server
  const {error} = await schema.validate(user);
  if (error) {
    throw new ApiError(400, error.message);
  }
  return true;
};
