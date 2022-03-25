import {successResponse, errorResponse, extractBusinessData}
  from '../utils/helpers';
import {createBusiness, findBusinessBy, updateBusinessBy,
  deleteBusinessById} from '../services';
import db from '../database/models';
const {Business} = db;

/**
 * Get all businesses
 *
 * @param {Request} req The request from the endpoint.
 * @param {Response} res The response returned by the method.
 * @param {Response} next The response returned by the method.
 * @memberof BusinessController
 * @return {JSON} A JSON response with the registered
 *  business's details and a JWT.
 */
export const getAllBusinesses = async (req, res, next) => {
  try {
    const businesses = await Business.findAll({});

    res.status(200).json({
      success: true,
      businesses,
    });

    successResponse(res, {...businesses}, 201);
  } catch (error) {
    errorResponse(res, {
      message: error.message,
    });
  }
};

/**
 * Creates a new Business.
 *
 * @param {Request} req The request from the endpoint.
 * @param {Response} res The response returned by the method.
 * @memberof BusinnessController
 * @return {JSON} A JSON response with the created Business's details.
 */
export const addBusiness = async (req, res) => {
  try {
    const {businessName, natureOfBusiness, businessEmail,
      businessAddress, businessType, cacCertURL, userId} = req.body;
    const businessDetails = {
      businessName,
      natureOfBusiness,
      businessEmail,
      businessAddress,
      businessType,
      cacCertURL,
      userId,
    };
    const newBusiness = await createBusiness(businessDetails);
    successResponse(res, {...newBusiness}, 201);
  } catch (error) {
    errorResponse(res, {
      message: error.message,
    });
  }
};

// export const addBusiness = async (req, res) => {
// try {
// const {body} = req;
// const business = await createBusiness(body);
// successResponse(res, {...business}, 201);
// } catch (error) {
// errorResponse(res, {
// message: error.message,
// });
// }
// };


/**
  * Gets a business profile after registeration or sign-in.
  *
  * @static
  * @param {Request} req - The request from the endpoint.
  * @param {Response} res - The response returned by the method.
  * @return { JSON } A JSON response with the business's profile details.
  * @memberof BusinessController
  */
export const businessProfile = async (req, res) => {
  try {
    const id = req.params.businessId;
    const business = await findBusinessBy({id});
    const businessResponse = extractBusinessData(business);
    successResponse(res, businessResponse, 200);
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};

/**
 * Updates a business profile (admin)
 *

 * @param {Request} req - The request from the endpoint.
 * @param {Response} res - The response returned by the method.
 * @return { JSON } A JSON response with the new business's profile update.
 * @memberof BusinessController
 */
export const updateBusinessProfile= async (req, res) => {
  try {
    const id = req.params.businessId;
    const business = await updateBusinessBy(req.body, {id});
    const businessResponse = extractBusinessData(business);
    successResponse(res, businessResponse, 200);
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};

/**
 * Updates a business profile.
 *

 * @param {Request} req - The request from the endpoint.
 * @param {Response} res - The response returned by the method.
 * @return { JSON } A JSON response with the new business's profile update.
 * @memberof BusinessController
 */
export const updateMyBusinessProfile= async (req, res) => {
  try {
    const business = await findBusinessBy({userId: req.user.id});
    const id = business.id;
    const newBusiness = await updateBusinessBy(req.body, {id});
    const businessResponse = extractBusinessData(newBusiness);
    successResponse(res, businessResponse, 200);
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};


/**
  * Deletes a business on a travel request.
  *
  * @param {Request} req - The request from the endpoint.
  * @param {Response} res - The response returned by the method.
  * @return { JSON } A JSON response containing with an empty data object.
  * @memberof BusinessController
  */
export const deleteBusiness = async (req, res) => {
  try {
    const businessId = req.params.businessId;
    const rowDeleted = await deleteBusinessById(businessId);
    if (!rowDeleted) return errorResponse(res, {});
    successResponse(res, {id: businessId}, 200);
  } catch (err) {
    errorResponse(res, {});
  }
};

/**
  * Deletes a business on a travel request.
  *
  * @param {Request} req - The request from the endpoint.
  * @param {Response} res - The response returned by the method.
  * @return { JSON } A JSON response containing with an empty data object.
  * @memberof BusinessController
  */
export const deleteMyBusinessAccount = async (req, res) => {
  try {
    const business = await findBusinessBy({userId: req.user.id});
    const businessId = business.id;
    const rowDeleted = await deleteBusinessById(businessId);
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
export const getMyBusinessDetails = async (req, res, next) => {
  try {
    const business = await findBusinessBy({userId: req.user.id});
    if (!business) {
      return errorResponse(res, {code: 401, message:
        'This user does not exist or is logged out. Please login or sign up.'});
    }
    // user.token =
    // generateToken({email: user.email});
    const response = extractBusinessData(business);
    // const {token} = loginResponse;
    // res.cookie('token', token, {maxAge: 86400000, httpOnly: true});
    successResponse(res, {...response});
  } catch (error) {
    errorResponse(res, {});
  }
};
