import {successResponse, errorResponse,
  extractProductData} from '../utils/helpers';
// import {findBusinessBy} from '../services';

import {createProduct, findProductBy, updateProductBy,
  fetchAllProducts, deleteProduct} from '../services';


/**
   * Creates a new Product.
   *
   * @param {Request} req The request from the endpoint.
   * @param {Response} res The response returned by the method.
   * @memberof BusinnessController
   * @return {JSON} A JSON response with the created Product's details.
   */
export const addProduct = async (req, res) => {
  // try {
  // const business = await findBusinessBy({userId: req.user.id});
  // const {productName, productTagline, productDescription,
  // productLink, category, productLogo, productBackground} = req.body;
  // const productDetails = {
  // productName,
  // productTagline,
  // productDescription,
  // productLink,
  // category,
  // productLogo,
  // productBackground,
  // businessId: business.id,
  // userId: req.user.id,
  // };
  // const product = await createProduct(productDetails);
  // successResponse(res, {...product}, 201);
  // } catch (error) {
  // errorResponse(res, {
  // code: error.statusCode,
  // message: error.message,
  // });
  // }

  try {
    const {body} = req;
    const product = await createProduct(body);
    successResponse(res, {...product}, 201);
  } catch (error) {
    errorResponse(res, {
      message: error.message,
    });
  }
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

    res.status(200).json({
      success: true,
      products,
    });
    successResponse(res, {...products}, 201);
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
   * Get products that belong to a particular product.
   *
   * @static
   * @param {Request} req - The request from the browser.
   * @param {Response} res - The response returned by the method.
   * @return { JSON } A JSON response with the newly created booking.
   * @memberof ProductController
   */
export const getProductProducts = async (req, res) => {
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
export const deleteMyProductAccount = async (req, res) => {
  try {
    const product = await findProductBy({userId: req.user.id});
    const productId = product.id;
    const rowDeleted = await deleteProduct(productId);
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
export const getMyProductDetails = async (req, res, next) => {
  try {
    const product = await findProductBy({userId: req.user.id});
    if (!product) {
      return errorResponse(res, {code: 401, message:
            'This user exists or is logged out. Please login or sign up.'});
    }
    // user.token =
    // generateToken({email: user.email});
    const response = extractProductData(product);
    // const {token} = loginResponse;
    // res.cookie('token', token, {maxAge: 86400000, httpOnly: true});
    successResponse(res, {...response});
  } catch (error) {
    errorResponse(res, {});
  }
};


