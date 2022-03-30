

import {findUserBy} from './';
import db from '../database/models';
import ApiError from '../utils/apiError';
// const { Op } = require('@sequelize/core');
const {ProductImage} = db;

/**
 * Creates a new Product Image.
 *
 * @param {object} productImageInfo - The product to be saved in the database.
 * @memberof ProductImageService
 * @return {Promise<object>} A promise object with user detail.
 */
export const createProductImage = async (productImageInfo) => {
  const user = findUserBy({id: productImageInfo.userId});
  if (!user) throw new ApiError(404, `User with id: ${id} does not exist`);
  const newProductImage = await ProductImage.create(productImageInfo);

  return newProductImage.dataValues;
};

/**
 * Find a product review
 * @param {number | object | string} options - ProductImage search value
 * @return {Promise<object>} A promise object with user detail.
 * @memberof ProductImageService
 */
export const findProductImageBy = async (options) => {
  return ProductImage.findOne({where: options});
};

/**
 * Find all product reviews given a query
 * @param {number | object | string} options - ProductImage search value
 * @return {Promise<object>} A promise object with user detail.
 * @memberof ProductImageService
 */
export const findProductImagesBy = async (options) => {
  return ProductImage.findAll({where: options});
};

/**
 * Find all product reviews given a query
 * @param {number | object | string} options - ProductImage search value
 * @return {Promise<object>} A promise object with user detail.
 * @memberof ProductImageService
 */
export const findProrductImagesRating = async (options) => {
  await ProductImage.findAll({where: options,
    attributes: [
      [sequelize.fn('average', sequelize.col('rating')), 'total_ratings'],
    ],
  });

  // eslint-disable-next-line max-len
  // findAll({where: options}, {attributes: [[sequelize.fn('SUM', sequelize.col('rating')), 'ratings']]});
};

/**
   *
   * updates an existing ProductImage by ID
   * @static
   * @param {object} ProductImageData user properties to be updated
    * @param {string} id user id
   * @return {Promise<object | null | string> } an object containing the updated
   * properties of the user is returned on success
   * or a null value if update fails, and an error message if a user is not
   *  found
   * @memberof ProductImageService
   */
export const updateProductImageById = async (ProductImageData, id) => {
  const [rowaffected, [product]] = await ProductImage.update(
      ProductImageData,
      {returning: true, where: {id}},
  );
  if (!rowaffected) throw new ApiError('Not Found');
  return product;
};

/**
 * Function for update query
 *
*@param {object} newValues Object of fields to be updated
*@param {object} obj An object of the keys to be
 * searched e.g {id}, {productEmail}
 * @memberof ProductImageService
 * @return {Promise<ProductImage>} A promise object with product detail.
 */
export const updateProductImageBy = async (newValues, obj) => {
  const product = await findProductImageBy(obj);
  if (!product) {
    throw new ApiError(404, `ProductImage with ${obj} does not exist`);
  }

  return await product.update(newValues);
};

/**
  * Fetches a product instance based on it's primary key.
  * @param {integer} productId - Primary key of the product to be fetched.
  * @param {object} options - Additional query information
  * @return {Promise<array>} - An instance of ProductImage table including
  *  it's relationships.
  * @memberof ProductImageService
  */
export const findProductImageById = async (productId, options = {}) => {
  return ProductImage.findByPk(productId, options);
};

/**
 * Fetches all products
 * @return {Promise<array>} - An instance of notification
 *  table including it's relationships.
 * @memberof ProductImageService
 */
export const fetchAllProductImages = async () => {
  const products = await ProductImage.findAll({});
  return products;
};


/**
    * Updates all products' status to seen for a specific user.
    * @param {integer} productId - The product Id.
    * @return {Promise<array>} - An instance of product table including
    *  it's relationships.
    * @memberof ProductImageService
*/
export const deleteProductImage = async (productId) => {
  const deleted = await ProductImage.destroy({
    where: {id: productId},
  });
  return deleted;
};

