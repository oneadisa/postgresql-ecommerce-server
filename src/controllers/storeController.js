import {successResponse, errorResponse} from '../utils/helpers';

import {createStore, findStore, updateStoreById,
  fetchAllStores, deleteStore} from '../services';


/**
 * Creates a new Store.
 *
 * @param {Request} req The request from the endpoint.
 * @param {Response} res The response returned by the method.
 * @memberof BusinnessController
 * @return {JSON} A JSON response with the created Store's details.
 */
export const addStore = async (req, res) => {
  try {
    const {body} = req;
    const store = await createStore(body);
    successResponse(res, {...store}, 201);
  } catch (error) {
    errorResponse(res, {
      code: error.statusCode,
      message: error.message,
    });
  }
};

/**
 * Get all stores
 *
 * @static
 * @param {Request} req - The request from the browser.
 * @param {Response} res - The response returned by the method.
 * @return { JSON } A JSON response all the created stores.
 * @memberof BookingController
 */
export const getAllStores = async (req, res) => {
  try {
    const stores = await fetchAllStores();
    successResponse(res, {...stores}, 201);
  } catch (error) {
    errorResponse(res, {
      code: error.statusCode,
      message: error.message,
    });
  }
};


/**
 * Creates accommodation booking.
 *
 * @param {Request} req - The request from the browser.
 * @param {Response} res - The response returned by the method.
 * @return { JSON } A JSON response with the newly created booking.
 * @memberof StoreController
 */
export const getStoreDetails = async (req, res) => {
  try {
    // const id = req.params.id;
    const store = await findStore({id: req.params.id});
    // const userResponse = extractUserData(user);
    successResponse(res, store, 200);
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};

/**
 * Get products that belong to a particular store.
 *
 * @static
 * @param {Request} req - The request from the browser.
 * @param {Response} res - The response returned by the method.
 * @return { JSON } A JSON response with the newly created booking.
 * @memberof StoreController
 */
export const getStoreProducts = async (req, res) => {
  try {
    const id = req.params.id;
    const store = await findStore({id});
    // const userResponse = extractUserData(user);
    successResponse(res, store, 200);
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};

/**
 * Get logged in user store details.
 *
 * @static
 * @param {Request} req - The request from the browser.
 * @param {Response} res - The response returned by the method.
 * @return { JSON } A JSON response with the newly created booking.
 * @memberof StoreController
 */
export const getMyStoreDetails = async (req, res) => {
  try {
    const store = await findStore({userId: req.user.id});
    // const userResponse = extractUserData(user);
    successResponse(res, store, 200);
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};

/**
 * Update Store
 *
 * @static
 * @param {Request} req - The request from the browser.
 * @param {Response} res - The response returned by the method.
 * @return { JSON } A JSON response with the newly created booking.
 * @memberof BookingController
 */
export const updateStore = async (req, res) => {
  try {
    const {body} = req;
    const store = await updateStoreById(body);
    // const userResponse = extractUserData(user);
    successResponse(res, store, 200);
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};

/**
 * Delete Store.
 *
 * @static
 * @param {Request} req - The request from the browser.
 * @param {Response} res - The response returned by the method.
 * @return { JSON } A JSON response with the newly created booking.
 * @memberof BookingController
 */
export const deleteStoreAction = async (req, res) => {
  try {
    const storeId = parseInt(req.params.storeId, 10);
    const rowDeleted = await deleteStore(storeId);
    if (!rowDeleted) return errorResponse(res, {});
    successResponse(res, {id: storeId}, 200);
  } catch (err) {
    errorResponse(res, {});
  }
};
