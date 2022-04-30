import {successResponse, errorResponse,
  extractProductReviewData,
  //  extractProductData
} from '../utils/helpers';
import {findBusinessBy, findUserBy,
  // findProductBy
} from '../services';

import {createProductReview, findProductReviewBy, findProductReviewsBy,
  fetchAllProductReviews, deleteProductReview, findProductReviewsAndCountBy,
  updateProductReviewBy, findProductBy,
  findProductReviewsRating} from '../services';


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
    const product = await findProductBy({id: productId});
    const user = await findUserBy({id: userId});
    const owner = await findUserBy({id: product.userId});
    if (business) {
      const productReviewInfo = {
        comment,
        firstName: user.firstName,
        lastName: user.lastName,
        businessName: business.businessName,
        productName: product.productTitle,
        phoneNumber: user.phoneNumber,
        rating,
        productId,
        ownerId: owner.Id,
        userId,
      };
      const review = await findProductReviewBy({productId, userId});
      if (review) {
        const productReview = await updateProductReviewBy(req.body,
            {productId, userId});
        const productReviewResponse = extractProductReviewData(productReview);
        successResponse(res, productReviewResponse, 200);
      } else {
        const productReview = await createProductReview(productReviewInfo);
        const reviews = await findProductReviewsRating({id: productId});
        successResponse(res, {...productReview}, productResponse, 201);
        console.log(reviews);
      }
    } else {
      const productReviewInfo = {
        comment,
        firstName: user.firstName,
        lastName: user.lastName,
        productName: product.productTitle,
        phoneNumber: user.phoneNumber,
        rating,
        productId,
        ownerId: owner.id,
        userId,
      };
      const review = await findProductReviewBy({productId, userId});
      if (review) {
        const productReview = await updateProductReviewBy(req.body,
            {productId, userId});
        const productReviewResponse = extractProductReviewData(productReview);
        successResponse(res, productReviewResponse, 200);
      } else {
        const productReview = await createProductReview(productReviewInfo);
        const reviews = await findProductReviewsRating({id: productId});
        successResponse(res, {...productReview}, productResponse, 201);
        console.log(reviews);
      }
    }
  } catch (error) {
    errorResponse(res, {
      code: error.statusCode,
      message: error.message,
    });
  }
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
     * Get a particular product review details.
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
export const getProductRatingProduct = async (req, res) => {
  try {
    const id = req.params.productId;
    const productRating = await findProductReviewsRating({productId: id});
    const reach = 10/productRating[0].ratings;
    res.status(200).json({
      success: true,
      productRating,
      reach,
    });
    // return successResponse(res, productReviews, 200);
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
    const {count, rows} = await findProductReviewsAndCountBy({productId: id});
    res.status(200).json({
      success: true,
      count,
      rows,
    });
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
    const {count, rows} = await findProductReviewsBy({userId: req.user.id});
    if (!rows) {
      return errorResponse(res, {code: 401, message:
              'This user exists or is logged out. Please login or sign up.'});
    }
    res.status(200).json({
      success: true,
      count,
      rows,
    });
    // successResponse(res, {...productReviews}, 201);
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
export const getProductReviewDetailsUser = async (req, res, next) => {
  try {
    const {count, rows} = await
    findProductReviewsBy({userId: req.params.userId});
    if (!rows) {
      return errorResponse(res, {code: 401, message:
              'This user exists or is logged out. Please login or sign up.'});
    }
    res.status(200).json({
      success: true,
      count,
      rows,
    });
    // successResponse(res, {...productReviews}, 201);
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
export const getMyStoreProductReviews = async (req, res, next) => {
  try {
    const {count, rows} = await
    findProductReviewsBy({ownerId: req.user.id});
    if (!rows) {
      return errorResponse(res, {
        code: 401, message:
          'This user exists or is logged out. Please login or sign up.',
      });
    }
    res.status(200).json({
      success: true,
      count,
      rows,
    });
    // successResponse(res, {...productReviews}, 201);
  } catch (error) {
    errorResponse(res, {});
  }
};
