/* eslint-disable camelcase */
import {successResponse, errorResponse,
  extractProductImageData,
} from '../utils/helpers';
import {
// findProductBy
} from '../services';
// import cloudinary from 'cloudinary';
import {createProductImage, findProductImageBy, findProductImagesBy,
  updateProductImageBy,
  fetchAllProductImages, deleteProductImage,
  findProrductImagesRating} from '../services';


/**
       * Creates a new ProductImage.
       *
       * @param {Request} req The request from the endpoint.
       * @param {Response} res The response returned by the method.
       * @memberof BusinnessController
       * @return {JSON} A JSON response with the created
       *  ProductImage's details.
       */
export const addProductImage = async (req, res) => {
  try {
    const {
      publicId,
      url,
      productId,
      userId,
    } = req.body;

    // const result = await cloudinary.v2.uploader.upload( {
    // folder: 'products',
    // });

    const productImageInfo = {
      publicId,
      url,
      productId,
      userId,
    };
    const review = await findProductImageBy({productId, userId});
    if (review) {
      const productImage = await updateProductImageBy(req.body,
          {productId, userId});
      const productImageResponse = extractProductImageData(productImage);
      successResponse(res, productImageResponse, 200);
    } else {
      const productImage = await createProductImage(productImageInfo);
      const reviews = await findProrductImagesRating({id: productId});
      successResponse(res, {...productImage}, productResponse, 201);
      console.log(reviews);
    }
  } catch (error) {
    errorResponse(res, {
      code: error.statusCode,
      message: error.message,
    });
  }
};

/**
       * Get all productImages
       *
       * @static
       * @param {Request} req - The request from the browser.
       * @param {Response} res - The response returned by the method.
       * @return { JSON } A JSON response all the created productImages.
       * @memberof BookingController
       */
export const getAllProductImages = async (req, res) => {
  try {
    const productImages = await fetchAllProductImages();

    return res.status(200).json({
      success: true,
      productImages,
    });
    successResponse(res, {...productImages}, 201);
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
       * @memberof ProductImageController
       */
export const getProductImageDetails = async (req, res) => {
  try {
    const id = req.params.productImageId;
    const productImage = await findProductImageBy({id});
    const productImageResponse = extractProductImageData(productImage);
    successResponse(res, productImageResponse, 200);
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
       * @memberof ProductImageController
       */
export const getProductImagesProduct = async (req, res) => {
  try {
    const id = req.params.productId;
    const productImages = await findProductImagesBy({productId: id});
    // const userResponse = extractUserData(user);
    successResponse(res, productImages, 200);
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};

/**
       * Updates a productImage profile (admin)
       *

       * @param {Request} req - The request from the endpoint.
       * @param {Response} res - The response returned by the method.
       * @return { JSON } A JSON response with the new productImage's
       *  profile update.
       * @memberof ProductImageController
       */
export const updateProductImageProfile= async (req, res) => {
  try {
    const id = req.params.productImageId;
    const productImage = await updateProductImageBy(req.body, {id});
    const productImageResponse = extractProductImageData(productImage);
    successResponse(res, productImageResponse, 200);
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};


/**
          * Deletes a productImage on a travel request.
          *
          * @param {Request} req - The request from the endpoint.
          * @param {Response} res - The response returned by the method.
          * @return { JSON } A JSON response containing with an empty
          *  data object.
          * @memberof ProductImageController
          */
export const deleteProductImageAction = async (req, res) => {
  try {
    const productImageId = req.params.productImageId;
    const rowDeleted = await deleteProductImage(productImageId);
    if (!rowDeleted) return errorResponse(res, {});
    successResponse(res, {id: productImageId}, 200);
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
export const getMyProductImageDetails = async (req, res, next) => {
  try {
    const productImages = await findProductImagesBy({userId: req.user.id});
    if (!productImages) {
      return errorResponse(res, {code: 401, message:
                'This user exists or is logged out. Please login or sign up.'});
    }
    return res.status(200).json({
      success: true,
      productImages,
    });
    successResponse(res, {...productImages}, 201);
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
export const getProductImageDetailsUser = async (req, res, next) => {
  try {
    const productImages = await
    findProductImagesBy({userId: req.params.userId});
    if (!productImages) {
      return errorResponse(res, {code: 401, message:
                'This user exists or is logged out. Please login or sign up.'});
    }
    return res.status(200).json({
      success: true,
      productImages,
    });
    successResponse(res, {...productImages}, 201);
  } catch (error) {
    errorResponse(res, {});
  }
};

