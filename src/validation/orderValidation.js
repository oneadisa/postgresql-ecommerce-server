import Joi from 'joi';

import ApiError from '../utils/apiError';

/**
 * Validates order parameters upon registration
 *
 * @param {object} order The order object
 * @return {boolean} returns true/false.
 */
export const validateOrder = async (order) => {
  // Joi parameters to test against user inputs
  const schema = Joi.object({
    address: Joi.string().required()
        .label('Please enter an address for your order.'),
    city: Joi.string().required()
        .label('Please provide a city of delivery for your order.'),
    state: Joi.string().required()
        .label('Please provide a state of delivery for your order.'),
    country: Joi.string().required()
        .label('Please provide a country of delivery for your order.'),
    pinCode: Joi.number().required()
        .label('Please provide a pin code for your order.'),
    phoneNumber: Joi.number().required()
        .label('Please provide a phone number for your order.'),
    productName: Joi.string(),
    price: Joi.number(),
    quantity: Joi.number().required()
        .label('Please provide the quantity of the product in your order.'),
    image: Joi.string(),
    paymentInfoId: Joi.string(),
    paymentInfoStatus: Joi.string(),
    paidAt: Joi.string(),
    itemsPrice: Joi.number(),
    taxPrice: Joi.number(),
    deliveryPrice: Joi.number(),
    totalPrice: Joi.number(),
    orderStatus: Joi.string(),
    deliveredAt: Joi.string(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    businessName: Joi.string(),
    userId: Joi.number(),
    productId: Joi.number(),
    ownerId: Joi.number(),
    owner: Joi.string(),
    store: Joi.string(),
    business: Joi.string(),
  });
  const {error} = await schema.validateAsync(order);
  if (error) {
    throw new ApiError(400, error.message);
  }
  return true;
};
