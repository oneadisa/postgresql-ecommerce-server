

import {findUserBy} from './';
import db from '../database/models';
import ApiError from '../utils/apiError';

const {Store} = db;

/**
 * Creates a new Store.
 *
 * @param {object} storeInfo - The store to be saved in the database.
 * @memberof StoreService
 * @return {Promise<object>} A promise object with user detail.
 */
export const createStore = async (storeInfo) => {
  const user = findUserBy({id: storeInfo.userId});
  if (!user) throw new ApiError(404, `User with id: ${id} does not exist`);
  const newStore = await Store.create(storeInfo);

  return newStore.dataValues;
};

/**
 * Find a store
 * @param {number | object | string} options - Store search value
 * @return {Promise<object>} A promise object with user detail.
 * @memberof StoreService
 */
export const findStoreBy = async (options) => {
  return Store.findOne({where: options});
};

/**
   *
   * updates an existing Store by ID
   * @static
   * @param {object} StoreData user properties to be updated
    * @param {string} id user id
   * @return {Promise<object | null | string> } an object containing the updated
   * properties of the user is returned on success
   * or a null value if update fails, and an error message if a user is not
   *  found
   * @memberof StoreService
   */
export const updateStoreById = async (StoreData, id) => {
  const [rowaffected, [store]] = await Store.update(
      StoreData,
      {returning: true, where: {id}},
  );
  if (!rowaffected) throw new ApiError('Not Found');
  return store;
};

/**
 * Function for update query
 *
*@param {object} newValues Object of fields to be updated
*@param {object} obj An object of the keys to be
 * searched e.g {id}, {storeEmail}
 * @memberof StoreService
 * @return {Promise<Store>} A promise object with store detail.
 */
export const updateStoreBy = async (newValues, obj) => {
  const store = await findStoreBy(obj);
  if (!store) {
    throw new ApiError(404, `Store with ${obj} does not exist`);
  }

  return await store.update(newValues);
};

/**
  * Fetches a store instance based on it's primary key.
  * @param {integer} storeId - Primary key of the store to be fetched.
  * @param {object} options - Additional query information
  * @return {Promise<array>} - An instance of Store table including
  *  it's relationships.
  * @memberof StoreService
  */
export const findStoreById = async (storeId, options = {}) => {
  return Store.findByPk(storeId, options);
};

/**
 * Fetches all stores
 * @return {Promise<array>} - An instance of notification
 *  table including it's relationships.
 * @memberof StoreService
 */
export const fetchAllStores = async () => {
  const stores = await Store.findAll({});
  return stores;
};


/**
    * Updates all stores' status to seen for a specific user.
    * @param {integer} storeId - The store Id.
    * @return {Promise<array>} - An instance of store table including
    *  it's relationships.
    * @memberof StoreService
*/
export const deleteStore = async (storeId) => {
  const deleted = await Store.destroy({
    where: {id: storeId},
  });
  return deleted;
};

/**
* Get user's request history from database
* @param {integer} id - The user id
* @return {Promise<object>} A promise object with user requests.
* @memberof RequestService
*/
export const getRequests = async (id) => {
  return Request.findAll({
    include: [{
      model: Status,
      as: 'status',
      attributes: ['label'],
    },
    {
      model: User,
      as: 'manager',
      attributes: ['lineManager'],
    }],
    where: {requesterId: id},
  });
};
