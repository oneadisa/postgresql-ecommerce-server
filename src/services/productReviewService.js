

import {findUserBy} from './';
import db from '../database/models';
import ApiError from '../utils/apiError';

const {ProductReview} = db;

/**
 * Creates a new Product Review.
 *
 * @param {object} productReviewInfo - The product to be saved in the database.
 * @memberof ProductReviewService
 * @return {Promise<object>} A promise object with user detail.
 */
export const createProductReview = async (productReviewInfo) => {
  const user = findUserBy({id: productReviewInfo.userId});
  if (!user) throw new ApiError(404, `User with id: ${id} does not exist`);
  const newProductReview = await ProductReview.create(productReviewInfo);

  return newProductReview.dataValues;
};

/**
 * Find a product review
 * @param {number | object | string} options - ProductReview search value
 * @return {Promise<object>} A promise object with user detail.
 * @memberof ProductReviewService
 */
export const findProductReviewBy = async (options) => {
  return ProductReview.findOne({where: options});
};

/**
 * Find all product reviews given a query
 * @param {number | object | string} options - ProductReview search value
 * @return {Promise<object>} A promise object with user detail.
 * @memberof ProductReviewService
 */
export const findProductReviewsBy = async (options) => {
  return ProductReview.findAll({where: options});
};

/**
   *
   * updates an existing ProductReview by ID
   * @static
   * @param {object} ProductReviewData user properties to be updated
    * @param {string} id user id
   * @return {Promise<object | null | string> } an object containing the updated
   * properties of the user is returned on success
   * or a null value if update fails, and an error message if a user is not
   *  found
   * @memberof ProductReviewService
   */
export const updateProductReviewById = async (ProductReviewData, id) => {
  const [rowaffected, [product]] = await ProductReview.update(
      ProductReviewData,
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
 * @memberof ProductReviewService
 * @return {Promise<ProductReview>} A promise object with product detail.
 */
export const updateProductReviewBy = async (newValues, obj) => {
  const product = await findProductReviewBy(obj);
  if (!product) {
    throw new ApiError(404, `ProductReview with ${obj} does not exist`);
  }

  return await product.update(newValues);
};

/**
  * Fetches a product instance based on it's primary key.
  * @param {integer} productId - Primary key of the product to be fetched.
  * @param {object} options - Additional query information
  * @return {Promise<array>} - An instance of ProductReview table including
  *  it's relationships.
  * @memberof ProductReviewService
  */
export const findProductReviewById = async (productId, options = {}) => {
  return ProductReview.findByPk(productId, options);
};

/**
 * Fetches all products
 * @return {Promise<array>} - An instance of notification
 *  table including it's relationships.
 * @memberof ProductReviewService
 */
export const fetchAllProductReviews = async () => {
  const products = await ProductReview.findAll({});
  return products;
};


/**
    * Updates all products' status to seen for a specific user.
    * @param {integer} productId - The product Id.
    * @return {Promise<array>} - An instance of product table including
    *  it's relationships.
    * @memberof ProductReviewService
*/
export const deleteProductReview = async (productId) => {
  const deleted = await ProductReview.destroy({
    where: {id: productId},
  });
  return deleted;
};

/**
* Get user's request history from database
* @param {integer} id - The user id
* @return {Promise<object>} A promise object with user requests.
* @memberof RequestService
*/
// export const getRequests = async (id) => {
//   return Request.findAll({
// include: [{
//   model: Status,
//   as: 'status',
//   attributes: ['label'],
// },
// {
//   model: User,
//   as: 'manager',
//   attributes: ['lineManager'],
// }],
// where: {requesterId: id},
//   });
// };
