
import db from '../database/models';
import ApiError from '../utils/apiError';

const {Order} = db;

/**
 * Creates a new Product Review.
 *
 * @param {object} orderInfo - The order to be saved in the database.
 * @memberof OrderService
 * @return {Promise<object>} A promise object with user detail.
 */
export const createOrder = async (orderInfo) => {
  const newOrder = await Order.create(orderInfo);

  return newOrder.dataValues;
};

/**
 * Find a order
 * @param {number | object | string} options - Order search value
 * @return {Promise<object>} A promise object with user detail.
 * @memberof OrderService
 */
export const findOrderBy = async (options) => {
  return Order.findOne({where: options});
};

/**
 * Find all orders given a query
 * @param {number | object | string} options - Order search value
 * @return {Promise<object>} A promise object with user detail.
 * @memberof OrderService
 */
export const findOrdersBy = async (options) => {
  return Order.findAll({where: options});
};

/**
   * Find all product order given a query and sum
   * @param {number | object | string} options - Order search value
   * @return {Promise<object>} A promise object with user detail.
   * @memberof OrderService
   */
export const findOrderPriceSum = async (options) => {
  return await Order.sum('itemsPrice', {where: options});
};

/**
   * Find all product order given a query and sum
   * @param {number | object | string} options - Order search value
   * @return {Promise<object>} A promise object with user detail.
   * @memberof OrderService
   */
export const findOrderTotalPriceSum = async (options) => {
  return await Order.sum('totalPrice', {where: options});
};

/**
 * Find all orders given a query and give count
 * @param {number | object | string} options - Order search value
 * @return {Promise<object>} A promise object with user detail.
 * @memberof OrderService
 */
export const findOrdersAndCountBy = async (options) => {
  return await Order.findAndCountAll({where: options});
};

/**
   *
   * updates an existing Order by ID
   * @static
   * @param {object} OrderData user properties to be updated
    * @param {string} id user id
   * @return {Promise<object | null | string> } an object containing the updated
   * properties of the user is returned on success
   * or a null value if update fails, and an error message if a user is not
   *  found
   * @memberof OrderService
   */
export const updateOrderById = async (OrderData, id) => {
  const [rowaffected, [order]] = await Order.update(
      OrderData,
      {returning: true, where: {id}},
  );
  if (!rowaffected) throw new ApiError('Not Found');
  return order;
};

/**
 * Function for update query
 *
*@param {object} newValues Object of fields to be updated
*@param {object} obj An object of the keys to be
 * searched e.g {id}, {orderEmail}
 * @memberof OrderService
 * @return {Promise<Order>} A promise object with order detail.
 */
export const updateOrderBy = async (newValues, obj) => {
  const order = await findOrderBy(obj);
  if (!order) {
    throw new ApiError(404, `Order with ${obj} does not exist`);
  }

  return await order.update(newValues);
};

/**
  * Fetches a order instance based on it's primary key.
  * @param {integer} orderId - Primary key of the order to be fetched.
  * @param {object} options - Additional query information
  * @return {Promise<array>} - An instance of Order table including
  *  it's relationships.
  * @memberof OrderService
  */
export const findOrderById = async (orderId, options = {}) => {
  return Order.findByPk(orderId, options);
};

/**
 * Fetches all orders
 * @return {Promise<array>} - An instance of notification
 *  table including it's relationships.
 * @memberof OrderService
 */
export const fetchAllOrders = async () => {
  const orders = await Order.findAll({});
  return orders;
};


/**
    * Updates all orders' status to seen for a specific user.
    * @param {integer} orderId - The order Id.
    * @return {Promise<array>} - An instance of order table including
    *  it's relationships.
    * @memberof OrderService
*/
export const deleteOrder = async (orderId) => {
  const deleted = await Order.destroy({
    where: {id: orderId},
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
