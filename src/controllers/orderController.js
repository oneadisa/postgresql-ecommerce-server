/* eslint-disable max-len */
/* eslint-disable camelcase */
import {
  successResponse, errorResponse,
  extractOrderData, extractProductData,
} from '../utils/helpers';
import {findBusinessBy, findUserBy, findStoreBy, findProductBy}
  from '../services';
import ApiError from '../utils/apiError';
import {
  createOrder, findOrderBy, findOrdersAndCountBy,
  updateOrderBy, updateProductBy, findOrderPriceSum,
  findOrderTotalPriceSum, findTransactionBy,
  fetchAllOrders, deleteOrder,
} from '../services';
import {
  createWallet, findWalletBy,
  addWalletTransaction, addTransaction,
} from '../services';
import {Op} from 'sequelize';
const {creditAccount, debitAccount} = require( '../utils/transfer');
const {v4} = require('uuid');
// const {Op} = require('sequelize');
const path = require('path');
import axios from 'axios';

/**
 * Payment controller
 *
 * @param {Request} req The request from the endpoint.
 * @param {Response} res The response returned by the method.
 * @memberof WalletController
 * @return {JSON} A JSON response with the registered
 *  wallet's details and a JWT.
 */
export const addCashOrder = async (req, res) => {
  try {
    res.sendFile(path.join(__dirname + '../../../flutterOrder.html'));
    // __dirname : It will resolve to your project folder.
  } catch (err) {
    errorResponse(res, {
      message: err.message,
    });
  }
};


/**
 * Creates a new Order.
 *
 * @param {Request} req The request from the endpoint.
 * @param {Response} res The response returned by the method.
 * @memberof OrderController
 * @return {JSON} A JSON response with the created Order's
 *  details.
 */
export const addCashOrderCallback = async (req, res) => {
  try {
    const {transaction_id} = req.query;
    // URL with transaction ID of which will be used to confirm
    //  transaction status
    const url = `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`;
    // Network call to confirm transaction status
    const response = await axios({
      url,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `${process.env.FLUTTERWAVE_V3_SECRET_KEY}`,
      },
    });
    console.log(response.data);
    const {currency, id} = response.data.data;
    const {status} = response.data.data;
    const {cartItems, userId, address, city, state, country,
      pinCode, phoneNumber} = response.data.data.meta;
    // check if transaction id already exist
    const transactionExist = await findTransactionBy({transactionId: id});
    if (transactionExist) {
      return res.status(409).
          send('Sorry, This Transaction Already Exists.');
    }

    const cartItemsArray = JSON.parse(cartItems);
    console.log(cartItemsArray);

    for (let i = 0; i < cartItemsArray.length; i++) {
      const user = await findUserBy({id: userId});
      const orderBusiness = await findBusinessBy({userId: user.id});
      const product = await findProductBy({id: cartItemsArray[i].productId});
      const store = await findStoreBy({id: product.storeId});
      const owner = await findUserBy({id: product.userId});
      const business = await findBusinessBy({userId: owner.id});
      const itemsPrice = cartItemsArray[i].price * cartItemsArray[i].quantity;
      const deliveryPrice = product.deliveryPrice;
      const taxPrice = 0.02651699 * (itemsPrice + deliveryPrice);
      const vendorsPay = itemsPrice + deliveryPrice;
      const totalPrice = itemsPrice + deliveryPrice + taxPrice;
      if (userId) {
        if (orderBusiness) {
          const orderInfo = {
            address,
            city,
            state,
            country,
            pinCode,
            phoneNumber,
            email: user.email,
            productName: product.productTitle,
            price: product.price,
            quantity: cartItemsArray[i].quantity,
            image: cartItemsArray[i].image,
            paymentInfoId: transaction_id,
            paymentInfoStatus: status,
            paidAt: Date.now(),
            itemsPrice,
            taxPrice,
            deliveryPrice,
            totalPrice,
            orderStatus: 'Processing',
            // deliveredAt,
            firstName: user.firstName,
            lastName: user.lastName,
            businessName: orderBusiness.businessName,
            userId,
            productId: product.id,
            ownerId: owner.id,
            owner: owner.firstName + ' ' + owner.lastName,
            store: store.storeName,
            business: business.businessName,
          };
          // orderInfo.itemsPrice = orderInfo.price * orderInfo.quantity;
          // orderInfo.totalPrice = orderInfo.itemsPrice + orderInfo.taxPrice +
          // orderInfo.deliveryPrice;
          // check if customer exist in our database
          // const owner = await findUserBy({email: customer.email});
          // check if user have a wallet, else create wallet
          await validateUserWallet(owner.id);
          // create wallet transaction
          await createWalletTransaction(owner.id, status, currency, vendorsPay);
          // create transaction
          await createTransaction(owner.id, id,
              status, currency, vendorsPay, owner);
          await updateWallet(owner.id, vendorsPay);
          await createOrder(orderInfo);
          // successResponse(res, {...order}, 201);
          // res.status(200).json({
          // success: true,
          // order,
          // walletTransaction,
          // transaction,
          // });
        } else {
          const orderInfo = {
            address,
            city,
            state,
            country,
            pinCode,
            phoneNumber,
            email: user.email,
            productName: product.productTitle,
            price: product.price,
            quantity,
            image,
            paymentInfoId: transaction_id,
            paymentInfoStatus: status,
            paidAt: Date.now(),
            itemsPrice,
            taxPrice,
            deliveryPrice: product.deliveryPrice,
            totalPrice,
            orderStatus: 'Processing',
            // deliveredAt,
            firstName: user.firstName,
            lastName: user.lastName,
            userId,
            productId: product.id,
            ownerId: owner.id,
            owner: owner.firstName + ' ' + owner.lastName,
            store: store.storeName,
            business: business.businessName,
          };
          // orderInfo.itemsPrice = orderInfo.price * orderInfo.quantity;
          orderInfo.totalPrice = orderInfo.itemsPrice + orderInfo.taxPrice +
            orderInfo.deliveryPrice;
          // check if customer exist in our database
          // const owner = await findUserBy({email: customer.email});
          // check if user have a wallet, else create wallet
          await validateUserWallet(owner.id);
          // create wallet transaction
          await createWalletTransaction(owner.id, status, currency, vendorsPay);
          // create transaction
          await createTransaction(owner.id, id,
              status, currency, vendorsPay, owner);
          await updateWallet(owner.id, vendorsPay);
          await createOrder(orderInfo);
          // successResponse(res, {...order}, 201);
          // res.status(200).json({
          // success: true,
          // order,
          // walletTransaction,
          // transaction,
          // });
        }
      } else {
        // const user = await findUserBy({id: userId});
        // const orderBusiness = await findBusinessBy({userId: user.id});
        const product = await findProductBy({id: cartItemsArray[i].productId});
        const store = await findStoreBy({id: product.storeId});
        const owner = await findUserBy({id: product.userId});
        const business = await findBusinessBy({userId: owner.id});
        const itemsPrice = cartItemsArray[i].price * cartItemsArray[i].quantity;
        const deliveryPrice = product.deliveryPrice;
        const taxPrice = 0.02651699 * (itemsPrice + deliveryPrice);
        const vendorsPay = itemsPrice + deliveryPrice;
        const totalPrice = itemsPrice + deliveryPrice + taxPrice;
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
          paymentInfoId: transaction_id,
          paymentInfoStatus: status,
          paidAt: Date.now(),
          itemsPrice,
          taxPrice,
          deliveryPrice: product.deliveryPrice,
          totalPrice,
          orderStatus: 'Processing',
          // deliveredAt,
          firstName,
          lastName,
          businessName,
          userId,
          productId: product.id,
          ownerId: owner.id,
          owner: owner.firstName + ' ' + owner.lastName,
          store: store.storeName,
          business: business.businessName,
        };
        // orderInfo.itemsPrice = orderInfo.price * orderInfo.quantity;
        orderInfo.totalPrice = orderInfo.itemsPrice + orderInfo.taxPrice +
          orderInfo.deliveryPrice;
        // check if customer exist in our database
        // const owner = await findUserBy({email: customer.email});
        // check if user have a wallet, else create wallet
        await validateUserWallet(owner.id);
        // create wallet transaction
        await createWalletTransaction(owner.id, status, currency, vendorsPay);
        // create transaction
        createTransaction(owner.id, id,
            status, currency, vendorsPay, owner);
        await updateWallet(owner.id, vendorsPay);
        await createOrder(orderInfo);
        // successResponse(res, {...order}, 201);
        // res.status(200).json({
        // success: true,
        // order,
        // walletTransaction,
        // transaction,
        // });
      }
    }

    const {count, rows} = await
    findOrdersAndCountBy({userId});
    // req.body.images = imagesLinks;
    // req.body.user = req.user.id;
    // const product = await Product.create(req.body);
    // successResponse(res, {...product}, 201);
    res.status(200).json({
      success: true,
      // result,
      orders: {
        count,
        rows,
      },
    });
    // const {
    // quantity,
    // image,
    // itemsPrice,
    // totalPrice,
    // taxPrice,
    // orderStatus,
    // deliveredAt,
    // firstName,
    // lastName,
    // businessName,
    // productId,
    // } = response.data.data.meta;
    // const user = await findUserBy({id: userId});
    // const orderBusiness = await findBusinessBy({userId: user.id});
    // const product = await findProductBy({id: productId});
    // const store = await findStoreBy({id: product.storeId});
    // const owner = await findUserBy({id: product.userId});
    // const business = await findBusinessBy({userId: owner.id});
    // if (userId) {
    // if (orderBusiness) {
    // const orderInfo = {
    // address,
    // city,
    // state,
    // country,
    // pinCode,
    // phoneNumber,
    // email: user.email,
    // productName: product.productTitle,
    // price: product.price,
    // quantity,
    // image,
    // paymentInfoId: transaction_id,
    // paymentInfoStatus: status,
    // paidAt: Date.now(),
    // itemsPrice,
    // taxPrice,
    // deliveryPrice: product.deliveryPrice,
    // totalPrice,
    // orderStatus,
    // deliveredAt,
    // firstName: user.firstName,
    // lastName: user.lastName,
    // businessName: orderBusiness.businessName,
    // userId,
    // productId,
    // ownerId: owner.id,
    // owner: owner.firstName + ' ' + owner.lastName,
    // store: store.storeName,
    // business: business.businessName,
    // };
    // orderInfo.itemsPrice = orderInfo.price * orderInfo.quantity;
    // orderInfo.totalPrice = orderInfo.itemsPrice + orderInfo.taxPrice +
    // orderInfo.deliveryPrice;
    // check if customer exist in our database
    // const owner = await findUserBy({email: customer.email});
    // check if user have a wallet, else create wallet
    // await validateUserWallet(owner.id);
    // create wallet transaction
    // const walletTransaction = await createWalletTransaction(owner.id, status, currency, amount);
    // create transaction
    // const transaction = await createTransaction(owner.id, id,
    // status, currency, amount, owner);
    // await updateWallet(owner.id, amount);
    // const order = await createOrder(orderInfo);
    // successResponse(res, {...order}, 201);
    // res.status(200).json({
    // success: true,
    // order,
    // walletTransaction,
    // transaction,
    // });
    // } else {
    // const orderInfo = {
    // address,
    // city,
    // state,
    // country,
    // pinCode,
    // phoneNumber,
    // email: user.email,
    // productName: product.productTitle,
    // price: product.price,
    // quantity,
    // image,
    // paymentInfoId: transaction_id,
    // paymentInfoStatus: status,
    // paidAt: Date.now(),
    // itemsPrice,
    // taxPrice,
    // deliveryPrice: product.deliveryPrice,
    // totalPrice,
    // orderStatus,
    // deliveredAt,
    // firstName: user.firstName,
    // lastName: user.lastName,
    // userId,
    // productId,
    // ownerId: owner.id,
    // owner: owner.firstName + ' ' + owner.lastName,
    // store: store.storeName,
    // business: business.businessName,
    // };
    // orderInfo.itemsPrice = orderInfo.price * orderInfo.quantity;
    // orderInfo.totalPrice = orderInfo.itemsPrice + orderInfo.taxPrice +
    // orderInfo.deliveryPrice;
    // check if customer exist in our database
    // const owner = await findUserBy({email: customer.email});
    // check if user have a wallet, else create wallet
    // await validateUserWallet(owner.id);
    // create wallet transaction
    // const walletTransaction = await createWalletTransaction(owner.id, status, currency, amount);
    // create transaction
    // const transaction = await createTransaction(owner.id, id,
    // status, currency, amount, customer);
    // await updateWallet(owner.id, amount);
    // const order = await createOrder(orderInfo);
    // successResponse(res, {...order}, 201);
    // res.status(200).json({
    // success: true,
    // order,
    // walletTransaction,
    // transaction,
    // });
    // }
    // } else {
    // const product = await findProductBy({id: productId});
    // const store = await findStoreBy({id: product.storeId});
    // const owner = await findUserBy({id: product.userId});
    // const business = await findBusinessBy({userId: owner.id});
    // const orderInfo = {
    // address,
    // city,
    // state,
    // country,
    // pinCode,
    // phoneNumber,
    // productName: product.productTitle,
    // price: product.price,
    // quantity,
    // image,
    // paymentInfoId: transaction_id,
    // paymentInfoStatus: status,
    // paidAt: Date.now(),
    // itemsPrice,
    // taxPrice,
    // deliveryPrice: product.deliveryPrice,
    // totalPrice,
    // orderStatus,
    // deliveredAt,
    // firstName,
    // lastName,
    // businessName,
    // userId,
    // productId,
    // ownerId: owner.id,
    // owner: owner.firstName + ' ' + owner.lastName,
    // store: store.storeName,
    // business: business.businessName,
    // };
    // orderInfo.itemsPrice = orderInfo.price * orderInfo.quantity;
    // orderInfo.totalPrice = orderInfo.itemsPrice + orderInfo.taxPrice +
    // orderInfo.deliveryPrice;
    // check if customer exist in our database
    // const owner = await findUserBy({email: customer.email});
    // check if user have a wallet, else create wallet
    // await validateUserWallet(owner.id);
    // create wallet transaction
    // const walletTransaction = await createWalletTransaction(owner.id, status, currency, amount);
    // create transaction
    // const transaction = await createTransaction(owner.id, id,
    // status, currency, amount, customer);
    // await updateWallet(owner.id, amount);
    // const order = await createOrder(orderInfo);
    // successResponse(res, {...order}, 201);
    // res.status(200).json({
    // success: true,
    // order,
    // walletTransaction,
    // transaction,
    // });
    // }
  } catch (error) {
    errorResponse(res, {
      code: error.statusCode,
      message: error.message,
    });
  }
};

/**
       * Creates a new Order.
       *
       * @param {Request} req The request from the endpoint.
       * @param {Response} res The response returned by the method.
       * @memberof OrderController
       * @return {JSON} A JSON response with the created Order's
       *  details.
       */
export const addWalletOrder = async (req, res) => {
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
      // orderStatus,
      // deliveredAt,
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
          email: user.email,
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
          orderStatus: 'Processing',
          // deliveredAt,
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
        const reference = v4();
        const summary = `Order from ${store.storeName}`;
        await Promise.all([
          debitAccount(
              {amount, userId: userId, purpose: `Payment for order from ${store.storeName}`, reference, summary,
                trnxSummary: `TRFR TO: ${owner.id}. TRNX REF:${reference} `}),
          creditAccount(
              {amount, userId: owner.id, purpose: `New Order`, reference, summary,
                trnxSummary: `TRFR FROM: ${userId}. TRNX REF:${reference} `}),
        ]);
        const order = await createOrder(orderInfo);
        // successResponse(res, {...order}, 201);
        res.status(200).json({
          success: true,
          order,
          // walletTransaction,
        });
      } else {
        const orderInfo = {
          address,
          city,
          state,
          country,
          pinCode,
          phoneNumber,
          email: user.email,
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
          orderStatus: 'Processing',
          // deliveredAt,
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
        const reference = v4();
        const summary = `Order from ${store.storeName}`;
        await Promise.all([
          debitAccount(
              {amount, userId: userId, purpose: `Payment for order from ${store.storeName}`, reference, summary,
                trnxSummary: `TRFR TO: ${owner.id}. TRNX REF:${reference} `}),
          creditAccount(
              {amount, userId: owner.id, purpose: `New Order`, reference, summary,
                trnxSummary: `TRFR FROM: ${userId}. TRNX REF:${reference} `}),
        ]);
        const order = await createOrder(orderInfo);
        // successResponse(res, {...order}, 201);
        res.status(200).json({
          success: true,
          order,
          // walletTransaction,
        });
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
        orderStatus: 'Processing',
        // deliveredAt,
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
      const reference = v4();
      const summary = `Order from ${store.storeName}`;
      await Promise.all([
        debitAccount(
            {amount, userId: userId, purpose: `Payment for order from ${store.storeName}`, reference, summary,
              trnxSummary: `TRFR TO: ${owner.id}. TRNX REF:${reference} `}),
        creditAccount(
            {amount, userId: owner.id, purpose: `Order`, reference, summary,
              trnxSummary: `TRFR FROM: ${userId}. TRNX REF:${reference} `}),
      ]);
      const order = await createOrder(orderInfo);
      // successResponse(res, {...order}, 201);
      res.status(200).json({
        success: true,
        order,
        // walletTransaction,
      });
    }
  } catch (error) {
    errorResponse(res, {
      code: error.statusCode,
      message: error.message,
    });
  }
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
    const {count, rows} = await findOrdersAndCountBy({productId: id});
    // const userResponse = extractUserData(user);
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
       * Updates a order profile (admin)
       *

       * @param {Request} req - The request from the endpoint.
       * @param {Response} res - The response returned by the method.
       * @param {Response} next - The response returned by the method.
       * @return { JSON } A JSON response with the new order's
       *  profile update.
       * @memberof OrderController
       */
export const updateOrderProfile = async (req, res, next) => {
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
      const updatedOrder = await updateOrderBy({
        orderStatus: 'Delivered',
        deliveredAt: Date.now(),
      }, {id});
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
    const {count, rows} = await findOrdersAndCountBy({userId: req.user.id});
    if (!rows) {
      return errorResponse(res, {
        code: 401, message:
          // eslint-disable-next-line max-len
          'This user does not exist or is logged out. Please login or sign up.',
      });
    }
    res.status(200).json({
      success: true,
      count,
      rows,
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
export const getMyStoreCustomerDetails = async (req, res, next) => {
  try {
    const {count, rows} = await
    findOrdersAndCountBy({
      ownerId: req.user.id, userId: {
        [Op.not]: null,
      },
    });
    if (!rows) {
      return errorResponse(res, {
        code: 401, message:
          // eslint-disable-next-line max-len
          'You do not have any customers yet.',
      });
    }
    res.status(200).json({
      success: true,
      count,
      rows,
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
    const {count, rows} = await
    findOrdersAndCountBy({ownerId: req.user.id});
    if (!rows) {
      return errorResponse(res, {
        code: 401, message:
          // eslint-disable-next-line max-len
          'You do not have any orders yet.',
      });
    }
    res.status(200).json({
      success: true,
      count,
      rows,
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
export const getMyStoreRaised = async (req, res, next) => {
  try {
    const sales = await
    findOrderPriceSum({ownerId: req.user.id});
    if (!sales) {
      return errorResponse(res, {
        code: 401, message:
          // eslint-disable-next-line max-len
          'You do not have any orders yet.',
      });
    }
    res.status(200).json({
      success: true,
      sales,
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
export const getMyStoreRevenue = async (req, res, next) => {
  try {
    const sales = await
    findOrderTotalPriceSum({ownerId: req.user.id});
    if (!sales) {
      return errorResponse(res, {
        code: 401, message:
          // eslint-disable-next-line max-len
          'You do not have any orders yet.',
      });
    }
    res.status(200).json({
      success: true,
      sales,
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
export const getStoreRaisedUser = async (req, res, next) => {
  try {
    const sales = await
    findOrderPriceSum({ownerId: req.params.ownerId});
    if (!sales) {
      return errorResponse(res, {
        code: 401, message:
          // eslint-disable-next-line max-len
          'You do not have any orders yet.',
      });
    }
    res.status(200).json({
      success: true,
      sales,
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
    const {count, rows} = await
    findOrdersAndCountBy({ownerId: req.params.ownerId});
    if (!rows) {
      return errorResponse(res, {
        code: 401, message:
          'This user does not have any orders yet.',
      });
    }
    res.status(200).json({
      success: true,
      count,
      rows,
    });
    // successResponse(res, {...orders}, 201);
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
export const getSingleStoreCustomerDetails = async (req, res, next) => {
  try {
    const {count, rows} = await
    findOrdersAndCountBy({
      ownerId: req.params.ownerId, userId: {
        [Op.not]: null,
      },
    });
    if (!rows) {
      return errorResponse(res, {
        code: 401, message:
          'This user does not have any orders yet.',
      });
    }
    res.status(200).json({
      success: true,
      count,
      rows,
    });
    // successResponse(res, {...orders}, 201);
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
    const {count, rows} = await
    findOrdersAndCountBy({userId: req.params.userId});
    if (!rows) {
      return errorResponse(res, {
        code: 401, message:
          // eslint-disable-next-line max-len
          'This user does not exist or is logged out. Please login or sign up.',
      });
    }
    res.status(200).json({
      success: true,
      count,
      rows,
    });
    successResponse(res, {...orders}, 201);
  } catch (error) {
    errorResponse(res, {});
  }
};

// Update wallet
const updateWallet = async (userId, amount) => {
  try {
    // update wallet
    const wallet = await findWalletBy({userId});
    const newWallet = await wallet.increment(
        'balance', {by: amount},
    );
    return newWallet;
  } catch (error) {
    console.log(error);
    // errorResponse(res, {
    //   message: error.message,
    // });
  }
};

// Create Wallet Transaction
const createWalletTransaction =
 async (userId, status, currency, amount)=> {
   try {
     const wallet = await findWalletBy({userId});
     // create wallet transaction
     const walletTransaction = await addWalletTransaction({
       amount,
       userId,
       isInflow: true,
       balanceBefore: Number(wallet.balance),
       balanceAfter: Number(wallet.balance) + Number(amount),
       currency,
       status,
     });
     return walletTransaction;
   } catch (error) {
     console.log(error);
     //  errorResponse(res, {
     //    message: error.message,
     //  });
   }
 };

// Validating User wallet
const validateUserWallet = async (userId) => {
  try {
    // check if user have a wallet, else create wallet
    const userWallet = await findWalletBy({userId});

    // If user wallet doesn't exist, create a new one
    if (!userWallet) {
      // create wallet
      const wallet = await createWallet({
        userId,
      });
      return wallet;
    }
    return userWallet;
  } catch (error) {
    errorResponse(res, {
      message: error.message,
    });
  }
};

// Create Transaction
const createTransaction = async (
    userId,
    id,
    status,
    currency,
    amount,
    owner,
) => {
  try {
    const wallet = await findWalletBy({userId});
    // create transaction
    const transaction = await addTransaction({
      userId,
      transactionId: id,
      name: owner.firstName+' '+owner.lastName,
      email: owner.email,
      phone: owner.phoneNumber,
      amount,
      currency,
      balanceBefore: Number(wallet.balance),
      balanceAfter: Number(wallet.balance) + Number(amount),
      paymentStatus: status,
      paymentGateway: 'flutterwave',
    });
    return transaction;
  } catch (error) {
    console.log(error);
  // errorResponse(res, {
  //   message: error.message,
  // });
  }
};
