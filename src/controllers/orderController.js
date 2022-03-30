import {successResponse, errorResponse,
  extractOrderData, extractProductData} from '../utils/helpers';
import {findBusinessBy, findUserBy, findStoreBy, findProductBy}
  from '../services';
import ApiError from '../utils/apiError';
import {createOrder, findOrderBy, findOrdersBy,
  updateOrderBy, updateProductBy,
  fetchAllOrders, deleteOrder} from '../services';


/**
       * Creates a new Order.
       *
       * @param {Request} req The request from the endpoint.
       * @param {Response} res The response returned by the method.
       * @memberof OrderController
       * @return {JSON} A JSON response with the created Order's
       *  details.
       */
export const addOrder = async (req, res) => {
  try {
    const {
      address,
      city,
      state,
      country,
      pinCode,
      phoneNumber,
      quantity,
      image,
      paymentInfoId,
      paymentInfoStatus,
      itemsPrice,
      totalPrice,
      taxPrice,
      orderStatus,
      deliveredAt,
      firstName,
      lastName,
      businessName,
      userId,
      productId,
    } = req.body;
    const user = await findUserBy({id: userId});
    const orderBusiness = await findBusinessBy({userId: user.id});
    const product = await findProductBy({id: productId});
    const store = await findStoreBy({id: product.storeId});
    const owner = await findUserBy({id: product.userId});
    const business = await findBusinessBy({userId: owner.id});
    if (userId) {
      if (orderBusiness) {
        const orderInfo = {
          address,
          city,
          state,
          country,
          pinCode,
          phoneNumber,
          productName: product.productTitle,
          price: product.price,
          quantity,
          image,
          paymentInfoId,
          paymentInfoStatus,
          paidAt: Date.now(),
          itemsPrice,
          taxPrice,
          deliveryPrice: product.deliveryPrice,
          totalPrice,
          orderStatus,
          deliveredAt,
          firstName: user.firstName,
          lastName: user.lastName,
          businessName: orderBusiness.businessName,
          userId,
          productId,
          ownerId: owner.id,
          owner: owner.firstName + ' ' + owner.lastName,
          store: store.storeName,
          business: business.businessName,
        };
        orderInfo.itemsPrice = orderInfo.price * orderInfo.quantity;
        orderInfo.totalPrice = orderInfo.itemsPrice + orderInfo.taxPrice +
        orderInfo.deliveryPrice;
        const order = await createOrder(orderInfo);
        successResponse(res, {...order}, 201);
      } else {
        const orderInfo = {
          address,
          city,
          state,
          country,
          pinCode,
          phoneNumber,
          productName: product.productTitle,
          price: product.price,
          quantity,
          image,
          paymentInfoId,
          paymentInfoStatus,
          paidAt: Date.now(),
          itemsPrice,
          taxPrice,
          deliveryPrice: product.deliveryPrice,
          totalPrice,
          orderStatus,
          deliveredAt,
          firstName: user.firstName,
          lastName: user.lastName,
          userId,
          productId,
          ownerId: owner.id,
          owner: owner.firstName + ' ' + owner.lastName,
          store: store.storeName,
          business: business.businessName,
        };
        orderInfo.itemsPrice = orderInfo.price * orderInfo.quantity;
        orderInfo.totalPrice = orderInfo.itemsPrice + orderInfo.taxPrice +
orderInfo.deliveryPrice;
        const order = await createOrder(orderInfo);
        successResponse(res, {...order}, 201);
      }
    } else {
      const product = await findProductBy({id: productId});
      const store = await findStoreBy({id: product.storeId});
      const owner = await findUserBy({id: product.userId});
      const business = await findBusinessBy({userId: owner.id});
      const orderInfo = {
        address,
        city,
        state,
        country,
        pinCode,
        phoneNumber,
        productName: product.productTitle,
        price: product.price,
        quantity,
        image,
        paymentInfoId,
        paymentInfoStatus,
        paidAt: Date.now(),
        itemsPrice,
        taxPrice,
        deliveryPrice: product.deliveryPrice,
        totalPrice,
        orderStatus,
        deliveredAt,
        firstName,
        lastName,
        businessName,
        userId,
        productId,
        ownerId: owner.id,
        owner: owner.firstName + ' ' + owner.lastName,
        store: store.storeName,
        business: business.businessName,
      };
      orderInfo.itemsPrice = orderInfo.price * orderInfo.quantity;
      orderInfo.totalPrice = orderInfo.itemsPrice + orderInfo.taxPrice +
       orderInfo.deliveryPrice;
      const order = await createOrder(orderInfo);
      successResponse(res, {...order}, 201);
    }
  } catch (error) {
    errorResponse(res, {
      code: error.statusCode,
      message: error.message,
    });
  }

  //   try {
  // const {body} = req;
  // const order = await createOrder(body);
  // successResponse(res, {...order}, 201);
  //   } catch (error) {
  // errorResponse(res, {
  //   message: error.message,
  // });
  //   }
};

/**
       * Get all orders
       *
       * @static
       * @param {Request} req - The request from the browser.
       * @param {Response} res - The response returned by the method.
       * @return { JSON } A JSON response all the created orders.
       * @memberof OrderController
       */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await fetchAllOrders();

    res.status(200).json({
      success: true,
      orders,
    });
    successResponse(res, {...orders}, 201);
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
       * @memberof OrderController
       */
export const getOrderDetails = async (req, res) => {
  try {
    const id = req.params.orderId;
    const order = await findOrderBy({id});
    const orderResponse = extractOrderData(order);
    successResponse(res, orderResponse, 200);
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};

/**
       * Get orders that belong to a particular product.
       *
       * @static
       * @param {Request} req - The request from the browser.
       * @param {Response} res - The response returned by the method.
       * @return { JSON } A JSON response with the newly created booking.
       * @memberof OrderController
       */
export const getOrdersProduct = async (req, res) => {
  try {
    const id = req.params.productId;
    const orders = await findOrdersBy({productId: id});
    // const userResponse = extractUserData(user);
    successResponse(res, orders, 200);
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};

/**
       * Updates a order profile (admin)
       *

       * @param {Request} req - The request from the endpoint.
       * @param {Response} res - The response returned by the method.
       * @param {Response} next - The response returned by the method.
       * @return { JSON } A JSON response with the new order's
       *  profile update.
       * @memberof OrderController
       */
export const updateOrderProfile= async (req, res, next) => {
  try {
    const id = req.params.orderId;
    const order = await findOrderBy({id});
    if (!order) {
      throw new ApiError(404, `Order with id: ${id} does not exist`);
    } else if (order.orderStatus === 'Delivered') {
      throw new ApiError(404, `You have already delivered this order.`);
    } else if (req.body.orderStatus === 'Delivered') {
      const id = req.params.orderId;
      const order = await findOrderBy({id});
      const updatedOrder = await updateOrderBy({orderStatus: 'Delivered',
        deliveredAt: Date.now()}, {id});
      const previousProduct = await findProductBy({id: order.productId});
      const newUnitCount = previousProduct.productUnitCount - order.quantity;
      const product = await updateProductBy({productUnitCount: newUnitCount},
          {id: order.productId});
      const productResponse = extractProductData(product);
      const orderResponse = extractOrderData(updatedOrder);
      successResponse(res, orderResponse, productResponse, 200);
    }
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};


/**
         * Updates a order profile.
         *

         * @param {Request} req - The request from the endpoint.
         * @param {Response} res - The response returned by the method.
         * @return { JSON } A JSON response with the new order's
         *  profile update.
         * @memberof OrderController
         */
// export const updateMyOrderProfile= async (req, res) => {
//   try {
// const order = await findOrderBy({userId: req.user.id});
// const id = order.id;
// const newOrder = await updateOrderBy(req.body, {id});
// const orderResponse = extractOrderData(newOrder);
// successResponse(res, orderResponse, 200);
//   } catch (error) {
// errorResponse(res, {code: error.statusCode, message: error.message});
//   }
// };


/**
          * Deletes a order on a travel request.
          *
          * @param {Request} req - The request from the endpoint.
          * @param {Response} res - The response returned by the method.
          * @return { JSON } A JSON response containing with an empty data
          *  object.
          * @memberof OrderController
          */
export const deleteOrderAction = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const rowDeleted = await deleteOrder(orderId);
    if (!rowDeleted) return errorResponse(res, {});
    successResponse(res, {id: orderId}, 200);
  } catch (err) {
    errorResponse(res, {});
  }
};

/**
          * Deletes a order on a travel request.
          *
          * @param {Request} req - The request from the endpoint.
          * @param {Response} res - The response returned by the method.
          * @return { JSON } A JSON response containing with an empty data
          *  object.
          * @memberof OrderController
          */
// export const deleteMyOrderAccount = async (req, res) => {
//   try {
// const order = await findOrderBy({userId: req.user.id});
// const orderId = order.id;
// const rowDeleted = await deleteOrder(orderId);
// if (!rowDeleted) return errorResponse(res, {});
// successResponse(res, {code: 200, message:
//  'Account Deleted Successfully.'}, 200);
//   } catch (err) {
// errorResponse(res, {});
//   }
// };

/**
         *
         *  Get profile order details
         * @static
         * @param {Request} req - The request from the endpoint.
         * @param {Response} res - The response returned by the method.
         * @param {Response} next - The response returned by the method.
         * @memberof Auth
         */
export const getMyOrderDetails = async (req, res, next) => {
  try {
    const orders = await findOrdersBy({userId: req.user.id});
    if (!orders) {
      return errorResponse(res, {code: 401, message:
                // eslint-disable-next-line max-len
                'This user does not exist or is logged out. Please login or sign up.'});
    }
    res.status(200).json({
      success: true,
      orders,
    });
    successResponse(res, {...orders}, 201);
  } catch (error) {
    errorResponse(res, {});
  }
};

/**
         *
         *  Get profile order details
         * @static
         * @param {Request} req - The request from the endpoint.
         * @param {Response} res - The response returned by the method.
         * @param {Response} next - The response returned by the method.
         * @memberof Auth
         */
export const getMyStoreOrderDetails = async (req, res, next) => {
  try {
    const orders = await findOrdersBy({ownerId: req.user.id});
    if (!orders) {
      return errorResponse(res, {code: 401, message:
                  // eslint-disable-next-line max-len
                  'You do not have any orders yet.'});
    }
    res.status(200).json({
      success: true,
      orders,
    });
    successResponse(res, {...orders}, 201);
  } catch (error) {
    errorResponse(res, {});
  }
};

/**
         *
         *  Get single user profile order details
         * @static
         * @param {Request} req - The request from the endpoint.
         * @param {Response} res - The response returned by the method.
         * @param {Response} next - The response returned by the method.
         * @memberof Auth
         */
export const getSingleStoreOrderDetails = async (req, res, next) => {
  try {
    const orders = await findOrdersBy({ownerId: req.params.ownerId});
    if (!orders) {
      return errorResponse(res, {code: 401, message:
                    // eslint-disable-next-line max-len
                    'This user does not have any orders yet.'});
    }
    res.status(200).json({
      success: true,
      orders,
    });
    successResponse(res, {...orders}, 201);
  } catch (error) {
    errorResponse(res, {});
  }
};

/**
         *
         *  Get profile order details
         * @static
         * @param {Request} req - The request from the endpoint.
         * @param {Response} res - The response returned by the method.
         * @param {Response} next - The response returned by the method.
         * @memberof Auth
         */
export const getOrderDetailsUser = async (req, res, next) => {
  try {
    const orders = await findOrdersBy({userId: req.params.userId});
    if (!orders) {
      return errorResponse(res, {code: 401, message:
                // eslint-disable-next-line max-len
                'This user does not exist or is logged out. Please login or sign up.'});
    }
    res.status(200).json({
      success: true,
      orders,
    });
    successResponse(res, {...orders}, 201);
  } catch (error) {
    errorResponse(res, {});
  }
};
