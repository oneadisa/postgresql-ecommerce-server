import {successResponse, errorResponse,
  extractStoreData} from '../utils/helpers';
import {findBusinessBy} from '../services';

import {createStore, findStoreBy, updateStoreBy,
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
    const {storeName, storeTagline, storeDescription,
      storeLink, category, storeLogo, storeBackground, userId} = req.body;
    const business = await findBusinessBy({userId});
    const storeDetails = {
      storeName,
      storeTagline,
      storeDescription,
      storeLink,
      category,
      storeLogo,
      storeBackground,
      businessId: business.id,
      userId,
    };
    const store = await createStore(storeDetails);
    successResponse(res, {...store}, 201);
  } catch (error) {
    errorResponse(res, {
      code: error.statusCode,
      message: error.message,
    });
  }

  // try {
  // const {body} = req;
  // const store = await createStore(body);
  // successResponse(res, {...store}, 201);
  // } catch (error) {
  // errorResponse(res, {
  // message: error.message,
  // });
  // }
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

    res.status(200).json({
      success: true,
      stores,
    });
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
    const id = req.params.storeId;
    const store = await findStoreBy({id});
    const storeResponse = extractStoreData(store);
    successResponse(res, storeResponse, 200);
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
    const store = await findStoreBy({id});
    // const userResponse = extractUserData(user);
    successResponse(res, store, 200);
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};

/**
 * Updates a store profile (admin)
 *

 * @param {Request} req - The request from the endpoint.
 * @param {Response} res - The response returned by the method.
 * @return { JSON } A JSON response with the new store's profile update.
 * @memberof StoreController
 */
export const updateStoreProfile= async (req, res) => {
  try {
    const id = req.params.storeId;
    const store = await updateStoreBy(req.body, {id});
    const storeResponse = extractStoreData(store);
    successResponse(res, storeResponse, 200);
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};

/**
   * Updates a store profile.
   *

   * @param {Request} req - The request from the endpoint.
   * @param {Response} res - The response returned by the method.
   * @return { JSON } A JSON response with the new store's profile update.
   * @memberof StoreController
   */
export const updateMyStoreProfile= async (req, res) => {
  try {
    const store = await findStoreBy({userId: req.user.id});
    const id = store.id;
    const newStore = await updateStoreBy(req.body, {id});
    const storeResponse = extractStoreData(newStore);
    successResponse(res, storeResponse, 200);
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};


/**
    * Deletes a store on a travel request.
    *
    * @param {Request} req - The request from the endpoint.
    * @param {Response} res - The response returned by the method.
    * @return { JSON } A JSON response containing with an empty data object.
    * @memberof StoreController
    */
export const deleteStoreAction = async (req, res) => {
  try {
    const storeId = req.params.storeId;
    const rowDeleted = await deleteStore(storeId);
    if (!rowDeleted) return errorResponse(res, {});
    successResponse(res, {id: storeId}, 200);
  } catch (err) {
    errorResponse(res, {});
  }
};

/**
    * Deletes a store on a travel request.
    *
    * @param {Request} req - The request from the endpoint.
    * @param {Response} res - The response returned by the method.
    * @return { JSON } A JSON response containing with an empty data object.
    * @memberof StoreController
    */
export const deleteMyStoreAccount = async (req, res) => {
  try {
    const store = await findStoreBy({userId: req.user.id});
    const storeId = store.id;
    const rowDeleted = await deleteStore(storeId);
    if (!rowDeleted) return errorResponse(res, {});
    successResponse(res, {code: 200, message:
         'Account Deleted Successfully.'}, 200);
  } catch (err) {
    errorResponse(res, {});
  }
};

/**
   *
   *  Get profile details
   * @static
   * @param {Request} req - The request from the endpoint.
   * @param {Response} res - The response returned by the method.
   * @param {Response} next - The response returned by the method.
   * @memberof Auth
   */
export const getMyStoreDetails = async (req, res, next) => {
  try {
    const store = await findStoreBy({userId: req.user.id});
    if (!store) {
      return errorResponse(res, {code: 401, message:
          'This user exists or is logged out. Please login or sign up.'});
    }
    // user.token =
    // generateToken({email: user.email});
    const response = extractStoreData(store);
    // const {token} = loginResponse;
    // res.cookie('token', token, {maxAge: 86400000, httpOnly: true});
    successResponse(res, {...response});
  } catch (error) {
    errorResponse(res, {});
  }
};

/**
   *
   *  Get profile details
   * @static
   * @param {Request} req - The request from the endpoint.
   * @param {Response} res - The response returned by the method.
   * @param {Response} next - The response returned by the method.
   * @memberof Auth
   */
export const getStoreDetailsUser = async (req, res, next) => {
  try {
    const store = await findStoreBy({userId: req.params.userId});
    if (!store) {
      return errorResponse(res, {code: 401, message:
          'This user exists or is logged out. Please login or sign up.'});
    }
    // user.token =
    // generateToken({email: user.email});
    const response = extractStoreData(store);
    // const {token} = loginResponse;
    // res.cookie('token', token, {maxAge: 86400000, httpOnly: true});
    successResponse(res, {...response});
  } catch (error) {
    errorResponse(res, {});
  }
};
