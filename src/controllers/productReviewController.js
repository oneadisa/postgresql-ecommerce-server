import {successResponse, errorResponse,
  extractProductReviewData} from '../utils/helpers';
import {findBusinessBy, findUserBy} from '../services';

import {createProductReview, findProductReviewBy, findProductReviewsBy,
  updateProductReviewBy,
  fetchAllProductReviews, deleteProductReview} from '../services';


/**
     * Creates a new ProductReview.
     *
     * @param {Request} req The request from the endpoint.
     * @param {Response} res The response returned by the method.
     * @memberof BusinnessController
     * @return {JSON} A JSON response with the created ProductReview's details.
     */
export const addProductReview = async (req, res) => {
  try {
    const {
      comment,
      rating,
      productId,
      userId,
    } = req.body;
    const business = await findBusinessBy({userId});
    const user = await findUserBy({id: userId});
    const productReviewInfo = {
      comment,
      firstName: user.firstName,
      lastName: user.lastName,
      businessName: business.businessName,
      rating,
      productId,
      userId,
    };
    const productReview = await createProductReview(productReviewInfo);
    successResponse(res, {...productReview}, 201);
  } catch (error) {
    errorResponse(res, {
      code: error.statusCode,
      message: error.message,
    });
  }

  //   try {
  // const {body} = req;
  // const productReview = await createProductReview(body);
  // successResponse(res, {...productReview}, 201);
  //   } catch (error) {
  // errorResponse(res, {
  //   message: error.message,
  // });
  //   }
};

/**
     * Get all productReviews
     *
     * @static
     * @param {Request} req - The request from the browser.
     * @param {Response} res - The response returned by the method.
     * @return { JSON } A JSON response all the created productReviews.
     * @memberof BookingController
     */
export const getAllProductReviews = async (req, res) => {
  try {
    const productReviews = await fetchAllProductReviews();

    res.status(200).json({
      success: true,
      productReviews,
    });
    successResponse(res, {...productReviews}, 201);
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
     * @memberof ProductReviewController
     */
export const getProductReviewDetails = async (req, res) => {
  try {
    const id = req.params.productReviewId;
    const productReview = await findProductReviewBy({id});
    const productReviewResponse = extractProductReviewData(productReview);
    successResponse(res, productReviewResponse, 200);
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};

/**
     * Get reviews that belong to a particular product.
     *
     * @static
     * @param {Request} req - The request from the browser.
     * @param {Response} res - The response returned by the method.
     * @return { JSON } A JSON response with the newly created booking.
     * @memberof ProductReviewController
     */
export const getProductReviewsProduct = async (req, res) => {
  try {
    const id = req.params.productId;
    const productReviews = await findProductReviewsBy({productId: id});
    // const userResponse = extractUserData(user);
    successResponse(res, productReviews, 200);
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};

/**
     * Updates a productReview profile (admin)
     *

     * @param {Request} req - The request from the endpoint.
     * @param {Response} res - The response returned by the method.
     * @return { JSON } A JSON response with the new productReview's
     *  profile update.
     * @memberof ProductReviewController
     */
export const updateProductReviewProfile= async (req, res) => {
  try {
    const id = req.params.productReviewId;
    const productReview = await updateProductReviewBy(req.body, {id});
    const productReviewResponse = extractProductReviewData(productReview);
    successResponse(res, productReviewResponse, 200);
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};

/**
       * Updates a productReview profile.
       *

       * @param {Request} req - The request from the endpoint.
       * @param {Response} res - The response returned by the method.
       * @return { JSON } A JSON response with the new productReview's
       *  profile update.
       * @memberof ProductReviewController
       */
// export const updateMyProductReviewProfile= async (req, res) => {
//   try {
// const productReview = await findProductReviewBy({userId: req.user.id});
// const id = productReview.id;
// const newProductReview = await updateProductReviewBy(req.body, {id});
// const productReviewResponse = extractProductReviewData(newProductReview);
// successResponse(res, productReviewResponse, 200);
//   } catch (error) {
// errorResponse(res, {code: error.statusCode, message: error.message});
//   }
// };


/**
        * Deletes a productReview on a travel request.
        *
        * @param {Request} req - The request from the endpoint.
        * @param {Response} res - The response returned by the method.
        * @return { JSON } A JSON response containing with an empty data object.
        * @memberof ProductReviewController
        */
export const deleteProductReviewAction = async (req, res) => {
  try {
    const productReviewId = req.params.productReviewId;
    const rowDeleted = await deleteProductReview(productReviewId);
    if (!rowDeleted) return errorResponse(res, {});
    successResponse(res, {id: productReviewId}, 200);
  } catch (err) {
    errorResponse(res, {});
  }
};

/**
        * Deletes a productReview on a travel request.
        *
        * @param {Request} req - The request from the endpoint.
        * @param {Response} res - The response returned by the method.
        * @return { JSON } A JSON response containing with an empty data object.
        * @memberof ProductReviewController
        */
// export const deleteMyProductReviewAccount = async (req, res) => {
//   try {
// const productReview = await findProductReviewBy({userId: req.user.id});
// const productReviewId = productReview.id;
// const rowDeleted = await deleteProductReview(productReviewId);
// if (!rowDeleted) return errorResponse(res, {});
// successResponse(res, {code: 200, message:
//  'Account Deleted Successfully.'}, 200);
//   } catch (err) {
// errorResponse(res, {});
//   }
// };

/**
       *
       *  Get profile details
       * @static
       * @param {Request} req - The request from the endpoint.
       * @param {Response} res - The response returned by the method.
       * @param {Response} next - The response returned by the method.
       * @memberof Auth
       */
export const getMyProductReviewDetails = async (req, res, next) => {
  try {
    const productReviews = await findProductReviewsBy({userId: req.user.id});
    if (!productReviews) {
      return errorResponse(res, {code: 401, message:
              'This user exists or is logged out. Please login or sign up.'});
    }
    res.status(200).json({
      success: true,
      productReviews,
    });
    successResponse(res, {...productReviews}, 201);
  } catch (error) {
    errorResponse(res, {});
  }
};


