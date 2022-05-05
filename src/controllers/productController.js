import {successResponse, errorResponse,
  extractProductData} from '../utils/helpers';
import {findStoreBy} from '../services';
// import cloudinary from 'cloudinary';
// import {v2 as cloudinary} from 'cloudinary';
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
import {createProduct, findProductBy, updateProductBy,
  fetchAllProducts, deleteProduct, findProductsBy,
  findProductImagesAndCountBy, createProductImage,
  findUserBy,
} from '../services';


/**
   * Creates a new Product.
   *
   * @param {Request} req The request from the endpoint.
   * @param {Response} res The response returned by the method.
   * @memberof BusinnessController
   * @return {JSON} A JSON response with the created Product's details.
   */
export const addProduct = async (req, res) => {
  try {
    const {productTitle,
      shortDescription,
      productDetails,
      discountedPrice,
      price,
      productUnitCount,
      deliveryPrice,
      category,
      userId,
      // images,
    } = req.body;
    const store = await findStoreBy({userId});
    let imagesArray = [];
    if (typeof req.body.images === 'string') {
      imagesArray.push(req.body.images);
    } else {
      imagesArray = req.body.images;
    }
    const productInfo = {
      productTitle,
      shortDescription,
      productDetails,
      discountedPrice,
      price,
      productUnitCount,
      deliveryPrice,
      category,
      storeId: store.id,
      userId,
      // images,
    };
    const preProduct = await createProduct(productInfo);
    const imagesLinks = [];
    for (let i = 0; i < imagesArray.length; i++) {
      const result = await cloudinary.uploader.upload(imagesArray[i], {
        folder: 'products',
      });
      console.log('success', result);
      imagesLinks.push({
        publicId: result.public_id,
        url: result.secure_url,
      });
    }
    for (let i = 0; i < imagesLinks.length; i++) {
      const {publicId, url} = imagesLinks[i];
      const productImageInfo = {
        publicId,
        url,
        productId: preProduct.id,
        userId,
      };
      await createProductImage(productImageInfo);
      // await createProductImage(imagesLinks[i], product.id,
      // userId );
    }

    // eslint-disable-next-line max-len
    const product = await updateProductBy({images: imagesLinks[0].url}, {id: preProduct.id});
    const {count, rows} = await
    findProductImagesAndCountBy({productId: preProduct.id});
    // req.body.images = imagesLinks;
    // req.body.user = req.user.id;
    // const product = await Product.create(req.body);
    // successResponse(res, {...product}, 201);
    return res.status(200).json({
      success: true,
      // result,
      preProduct,
      product,
      productImages: {
        count,
        rows,
      },
    });
  } catch (error) {
    errorResponse(res, {
      code: error.statusCode,
      message: error.message,
    });
  }

//   try {
  // const {body} = req;
  // const product = await createProduct(body);
  // successResponse(res, {...product}, 201);
//   } catch (error) {
  // errorResponse(res, {
  //   message: error.message,
  // });
//   }
};

/**
   * Get all products
   *
   * @static
   * @param {Request} req - The request from the browser.
   * @param {Response} res - The response returned by the method.
   * @return { JSON } A JSON response all the created products.
   * @memberof BookingController
   */
export const getAllProducts = async (req, res) => {
  try {
    const products = await fetchAllProducts();

    return res.status(200).json({
      success: true,
      products,
    });
    // successResponse(res, {products}, 201);
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
   * @memberof ProductController
   */
export const getProductDetails = async (req, res) => {
  try {
    const id = req.params.productId;
    const product = await findProductBy({id});
    const productResponse = extractProductData(product);
    successResponse(res, productResponse, 200);
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};

/**
   * Get a particular product.
   *
   * @static
   * @param {Request} req - The request from the browser.
   * @param {Response} res - The response returned by the method.
   * @return { JSON } A JSON response with the newly created booking.
   * @memberof ProductController
   */
export const getProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await findProductBy({id});
    // const userResponse = extractUserData(user);
    successResponse(res, product, 200);
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};

/**
   * Updates a product profile (admin)
   *

   * @param {Request} req - The request from the endpoint.
   * @param {Response} res - The response returned by the method.
   * @return { JSON } A JSON response with the new product's profile update.
   * @memberof ProductController
   */
export const updateProductProfile= async (req, res) => {
  try {
    const id = req.params.productId;
    const product = await updateProductBy(req.body, {id});
    const productResponse = extractProductData(product);
    successResponse(res, productResponse, 200);
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};

/**
     * Updates a product profile.
     *

     * @param {Request} req - The request from the endpoint.
     * @param {Response} res - The response returned by the method.
     * @return { JSON } A JSON response with the new product's profile update.
     * @memberof ProductController
     */
export const updateMyProductProfile= async (req, res) => {
  try {
    const product = await findProductBy({userId: req.user.id});
    const id = product.id;
    const newProduct = await updateProductBy(req.body, {id});
    const productResponse = extractProductData(newProduct);
    successResponse(res, productResponse, 200);
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};


/**
      * Deletes a product on a travel request.
      *
      * @param {Request} req - The request from the endpoint.
      * @param {Response} res - The response returned by the method.
      * @return { JSON } A JSON response containing with an empty data object.
      * @memberof ProductController
      */
export const deleteProductAction = async (req, res) => {
  try {
    const productId = req.params.productId;
    const rowDeleted = await deleteProduct(productId);
    if (!rowDeleted) return errorResponse(res, {});
    successResponse(res, {id: productId}, 200);
  } catch (err) {
    errorResponse(res, {});
  }
};

/**
      * Deletes a product on a travel request.
      *
      * @param {Request} req - The request from the endpoint.
      * @param {Response} res - The response returned by the method.
      * @return { JSON } A JSON response containing with an empty data object.
      * @memberof ProductController
      */
// export const deleteMyProductAccount = async (req, res) => {
//   try {
// const product = await findProductBy({userId: req.user.id});
// const productId = product.id;
// const rowDeleted = await deleteProduct(productId);
// if (!rowDeleted) return errorResponse(res, {});
// successResponse(res, {code: 200, message:
//    'Account Deleted Successfully.'}, 200);
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
export const getMyProductDetails = async (req, res, next) => {
  try {
    const {count, rows} = await findProductsBy({userId: req.user.id});
    if (!rows) {
      return errorResponse(res, {code: 401, message:
            'This user exists or is logged out. Please login or sign up.'});
    }
    return res.status(200).json({
      success: true,
      count,
      rows,
    });
    successResponse(res, {...products}, 201);
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
export const getProductDetailsUser = async (req, res, next) => {
  try {
    const products = await findProductsBy({userId: req.params.userId});
    if (!products) {
      return errorResponse(res, {code: 401, message:
            'This user exists or is logged out. Please login or sign up.'});
    }
    return res.status(200).json({
      success: true,
      products,
    });
    successResponse(res, {...products}, 201);
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
export const getProductStore = async (req, res, next) => {
  try {
    const product = await findProductBy({id: req.params.productId});
    const user = await findUserBy({id: product.userId});
    const store = await findStoreBy({userId: user.id});
    if (!product) {
      return errorResponse(res, {
        code: 401, message:
    'This user exists or is logged out. Please login or sign up.',
      });
    }
    return res.status(200).json({
      success: true,
      store,
      user,
      product,
    });
    // successResponse(res, {...products}, 201);
  } catch (error) {
    errorResponse(res, {});
  }
};

