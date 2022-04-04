

import {findUserBy} from './';
import db from '../database/models';
import ApiError from '../utils/apiError';

const {Product} = db;

/**
 * Creates a new Product.
 *
 * @param {object} productInfo - The product to be saved in the database.
 * @memberof ProductService
 * @return {Promise<object>} A promise object with user detail.
 */
export const createProduct = async (productInfo) => {
  const user = findUserBy({id: productInfo.userId});
  if (!user) throw new ApiError(404, `User with id: ${id} does not exist`);
  const newProduct = await Product.create(productInfo);

  return newProduct.dataValues;
};

/**
 * Find a product
 * @param {number | object | string} options - Product search value
 * @return {Promise<object>} A promise object with user detail.
 * @memberof ProductService
 */
export const findProductBy = async (options) => {
  return Product.findOne({where: options});
};

/**
 * Find all products matching the query
 * @param {number | object | string} options - Product search value
 * @return {Promise<object>} A promise object with user detail.
 * @memberof ProductService
 */
export const findProductsBy = async (options) => {
  return Product.findAndCountAll({where: options});
};

/**
   *
   * updates an existing Product by ID
   * @static
   * @param {object} ProductData user properties to be updated
    * @param {string} id user id
   * @return {Promise<object | null | string> } an object containing the updated
   * properties of the user is returned on success
   * or a null value if update fails, and an error message if a user is not
   *  found
   * @memberof ProductService
   */
export const updateProductById = async (ProductData, id) => {
  const [rowaffected, [product]] = await Product.update(
      ProductData,
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
 * @memberof ProductService
 * @return {Promise<Product>} A promise object with product detail.
 */
export const updateProductBy = async (newValues, obj) => {
  const product = await findProductBy(obj);
  if (!product) {
    throw new ApiError(404, `Product with ${obj} does not exist`);
  }

  return await product.update(newValues);
};

/**
  * Fetches a product instance based on it's primary key.
  * @param {integer} productId - Primary key of the product to be fetched.
  * @param {object} options - Additional query information
  * @return {Promise<array>} - An instance of Product table including
  *  it's relationships.
  * @memberof ProductService
  */
export const findProductById = async (productId, options = {}) => {
  return Product.findByPk(productId, options);
};

/**
 * Fetches all products
 * @return {Promise<array>} - An instance of notification
 *  table including it's relationships.
 * @memberof ProductService
 */
export const fetchAllProducts = async () => {
  const products = await Product.findAll({});
  return products;
};


/**
    * Updates all products' status to seen for a specific user.
    * @param {integer} productId - The product Id.
    * @return {Promise<array>} - An instance of product table including
    *  it's relationships.
    * @memberof ProductService
*/
export const deleteProduct = async (productId) => {
  const deleted = await Product.destroy({
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
