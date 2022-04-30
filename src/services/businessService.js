// import {findBusinessBy} from './';
import db from '../database/models';
import ApiError from '../utils/apiError';

const {Business} = db;

/**
 * Adds business to the database
 * @param {object} business The business to be added to the database.
 * @memberof BusinessService
 * @return {Promise<Business>} A promise object with business detail.
 */
export const createBusiness = async (business) => {
  const user = findBusinessBy({id: business.userId});
  if (!user) throw new ApiError(404, `Business with id: ${id} does not exist`);
  const newBusiness = await Business.create(business);

  return newBusiness.dataValues;
};

/**
 *
 * updates an existing business by ID
 * @param {object} businessData business properties to be updated
 * @param {number} id business id
 * @memberof BusinessService
 */
export const updateBusinessById = async (businessData, id) => {
  const business = await findBusinessBy({id: id});

  if (!business) {
    throw new ApiError(404,
        `Business with id: ${id} does not exist`);
  }

  return await business.update(businessData);
};

/**
 * Fetches all businesses
 * @return {Promise<array>} - An instance of notification
 *  table including it's relationships.
 * @memberof BusinessService
 */
export const fetchAllBusinessess = async () => {
  const businesses = await Business.findAll({});
  return businesses;
};

/**
 * Finds business in the database
 *
 * @param {object} options An object containing query options
 * @return {Promise<Business>} A promise object with business
 * detail if business exists.
 */
export const findBusinessBy = async (options) => {
  return await Business.findOne({where: options});
};

/**
 * Function for update query
 *
*@param {object} newValues Object of fields to be updated
*@param {object} obj An object of the keys to be
 * searched e.g {id}, {businessEmail}
 * @memberof BusinessService
 * @return {Promise<Business>} A promise object with business detail.
 */
export const updateBusinessBy = async (newValues, obj) => {
  const business = await findBusinessBy(obj);
  if (!business) {
    throw new ApiError(404, `Business with ${obj} does not exist`);
  }

  return await business.update(newValues);
};

/**
 * Deletes a business record from the database.
 * @param {number} businessId - id of business to be deleted from the database.
 * @return {Promise<object>} - A promise object which resolves
 * to the newly created business.
 * @memberof BusinessService
 */
export const deleteBusinessById= (businessId) => {
  return Business.destroy({where: {id: businessId}});
};
