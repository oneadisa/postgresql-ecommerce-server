/* eslint-disable max-len */
/* eslint-disable camelcase */
import {successResponse, errorResponse, extractWalletData}
  from '../utils/helpers';
import {
  createWallet, findWalletBy, updateWalletBy,
  deleteWalletById, addWalletTransaction,
  addTransaction, findUserBy, findTransactionBy,
} from '../services';
import db from '../database/models';
const {Wallet} = db;
const {creditAccount, debitAccount} = require( '../utils/transfer');
const {v4} = require('uuid');
// const path = require('path');
import axios from 'axios';
const crypto = require('crypto');
const secret = process.env.PAYSTACK_PRIVATE_KEY;
require('dotenv').config();


/**
 * Get Wallet balance
 *
 * @param {Request} req The request from the endpoint.
 * @param {Response} res The response returned by the method.
 * @param {Response} next The response returned by the method.
 * @memberof WalletController
 * @return {JSON} A JSON response with the registered
 *  wallet's details and a JWT.
 */
export const webhook = async (req, res, next) => {
  try {
    // validate event
    const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
    if (hash == req.headers['x-paystack-signature']) {
      // Retrieve the request's body
      const event = req.body;
      // Do something with event
      if (event.event === 'transfer.success') {
        const walletResponse = await getWithdrawResponse(event);
        return successResponse(res, {...walletResponse}, 201);
      } else if (event.event === 'charge.success') {
        const walletResponse = await getFundResponse(event);
        return successResponse(res, {...walletResponse}, 201);
      } else {
        console.log(event);
      }
    }
    res.send(200);
  } catch (error) {
    errorResponse(res, {
      message: error.message,
    });
  }
};

/**
 * Get Wallet balance
 *
 * @param {Request} req The request from the endpoint.
 * @param {Response} res The response returned by the method.
 * @param {Response} next The response returned by the method.
 * @memberof WalletController
 * @return {JSON} A JSON response with the registered
 *  wallet's details and a JWT.
 */
export const walletBalance = async (req, res, next) => {
  try {
    const {userId} = req.params;

    const userWallet = await findWalletBy({userId});
    // If user wallet doesn't exist, create a new one
    if (!userWallet) {
    // create wallet
      const wallet = await createWallet({
        userId,
      });
      return successResponse(res, wallet, 200);
    }
    // user
    return successResponse(res, userWallet, 200);
  } catch (error) {
    errorResponse(res, {
      message: error.message,
    });
  }
};

/**
 * Get Wallet balance
 *
 * @param {Request} req The request from the endpoint.
 * @param {Response} res The response returned by the method.
 * @param {Response} next The response returned by the method.
 * @memberof WalletController
 * @return {JSON} A JSON response with the registered
 *  wallet's details and a JWT.
 */
export const fw = async (req, res, next) => {
  try {
    const response = await got.post('https://api.flutterwave.com/v3/payments', {
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_V3_SECRET_KEY}`,
      },
      json: {
        tx_ref: 'hooli-tx-1920bbtytty',
        amount: '100',
        currency: 'NGN',
        redirect_url: 'https://webhook.site/9d0b00ba-9a69-44fa-a43d-a82c33c36fdc',
        meta: {
          consumer_id: 23,
          consumer_mac: '92a3-912ba-1192a',
        },
        customer: {
          email: 'user@gmail.com',
          phonenumber: '080****4528',
          name: 'Yemi Desola',
        },
        customizations: {
          title: 'Pied Piper Payments',
          logo: 'http://www.piedpiper.com/app/themes/joystick-v27/images/logo.png',
        },
      },
    }).json();
    console.log(response);
    return successResponse(res, {...response}, 201);
  } catch (err) {
    console.log(err.code);
    console.log(err.response.body);
    errorResponse(res, {
      message: err.message,
    });
  }
};

/**
 * Payment controller
 *
 * @param {Request} req The request from the endpoint.
 * @param {Response} res The response returned by the method.
 * @param {Response} next The response returned by the method.
 * @memberof WalletController
 * @return {JSON} A JSON response with the registered
 *  wallet's details and a JWT.
 */
export const fund = async (req, res, next) => {
  try {
    // return res.sendFile(path.join(__dirname + '../../../flutter.html'));
    // __dirname : It will resolve to your project folder.
    const {
      amount,
      userId,
    } = req.body;
    const user = await findUserBy({id: userId});
    console.log(user);
    const fundData = JSON.stringify({
      'amount': amount,
      'email': user.email,
      'reference': Date.now(),
      'currency': 'NGN',
      'callback_url': 'http://localhost:8080/api/wallet/fund/response',
      'metadata': {
        'consumer_id': user.id,
        'customer': {
          'email': user.email,
          'phone': user.phoneNumber,
          'name': user.firstName + ' ' + user.lastName,
        },
      },
    });
    console.log(fundData);
    const config = {
      method: 'post',
      url: 'https://api.paystack.co/transaction/initialize',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.PAYSTACK_PRIVATE_KEY}`,
      },
      data: fundData,
    };

    const initialise = await axios(config);
    console.log(initialise);

    const verify = {
      method: 'get',
      url: `https://api.paystack.co/transaction/verify/${initialise.data.data.reference}`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.PAYSTACK_PRIVATE_KEY}`,
      },
    };
    const finalise = await axios(verify);
    console.log(finalise);
    const walletResponse = await getFundResponse(finalise);
    return successResponse(res, {...walletResponse}, 201);
    // const response = finalise.data;
    // return res.redirect(response.data.link);
    // return successResponse(res, {...response}, 201);
  } catch (err) {
    errorResponse(res, {
      message: err.message,
    });
  }
};

/**
 * Payment controller
 *
 * @param {Request} req The request from the endpoint.
 * @param {Response} res The response returned by the method.
 * @param {Response} next The response returned by the method.
 * @memberof WalletController
 * @return {JSON} A JSON response with the registered
 *  wallet's details and a JWT.
 */
export const fundFlutter = async (req, res, next) => {
  try {
    // return res.sendFile(path.join(__dirname + '../../../flutter.html'));
    // __dirname : It will resolve to your project folder.
    const {
      amount,
      userId,
    } = req.body;
    const user = await findUserBy({id: userId});
    console.log(user);
    const fundData = ({
      'tx_ref': Date.now(),
      'amount': amount,
      'currency': 'NGN',
      'redirect_url': 'http://localhost:8080/api/wallet/fund/response',
      'meta': {
        'consumer_id': user.id,
        'consumer_mac': '92a3-912ba-1192a',
      },
      'customer': {
        'email': user.email,
        'phone_number': user.phoneNumber,
        'name': user.firstName+' '+user.lastName,
      },
      'customizations': {
        'title': 'Gaged Payments',
        'logo': 'https://www.linkpicture.com/q/Gaged-Blue.svg',
      },
    });
    console.log(fundData);
    const config = {
      method: 'post',
      url: 'https://api.flutterwave.com/v3/payments',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.FLUTTERWAVE_V3_SECRET_KEY}`,
      },
      data: fundData,
    };

    const preResponse = await axios(config);
    console.log(preResponse);
    const response = preResponse.data;
    return res.redirect(response.data.link);
    return successResponse(res, {...response}, 201);
  } catch (err) {
    errorResponse(res, {
      message: err.message,
    });
  }
};

/**
 * Withraw controller
 *
 * @param {Request} req The request from the endpoint.
 * @param {Response} res The response returned by the method.
 * @memberof WalletController
 * @return {JSON} A JSON response with the registered
 *  wallet's details and a JWT.
 */
export const withdraw = async (req, res) => {
  try {
    const {
      account_bank,
      account_number,
      amount,
      email,
    } = req.body;

    const transferData = JSON.stringify({
      'account_bank': account_bank,
      'account_number': account_number,
      'amount': amount,
      'metadata': {
        'email': email,
      },
    });
    console.log(transferData);
    console.log(account_bank);
    console.log(account_number);
    const verify = await axios({
      url: `https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${account_bank}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.PAYSTACK_PRIVATE_KEY}`,
      },
    });
    console.log(verify);

    const recipient = await axios({
      url: `https://api.paystack.co/transferrecipient`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.PAYSTACK_PRIVATE_KEY}`,
      },
      data: JSON.stringify({
        'type': 'nuban',
        'name': verify.data.data.account_name,
        'account_number': verify.data.data.account_number,
        'bank_code': account_bank,
        'currency': 'NGN',
      }),
    });
    console.log(recipient);
    const initiate = await axios({
      url: `https://api.paystack.co/transfer`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.PAYSTACK_PRIVATE_KEY}`,
      },
      data: JSON.stringify({
        'source': 'balance',
        'reason': 'Withdrawal from Gaged Wallet',
        'amount': amount,
        'recipient': recipient.data.data.recipient_code,
      }),
    });

    console.log(initiate);
    const response = initiate.data;
    // const walletResponse = await getWithdrawResponse(response);
    return successResponse(res, {...response}, 201);
    // return res.status(200).json({
    // response,
    // });
  } catch (error) {
    errorResponse(res, {
      message: error.message,
    });
  }
};

/**
 * Withraw controller
 *
 * @param {Request} req The request from the endpoint.
 * @param {Response} res The response returned by the method.
 * @memberof WalletController
 * @return {JSON} A JSON response with the registered
 *  wallet's details and a JWT.
 */
export const withdrawFlutter = async (req, res) => {
  try {
    const {
      account_bank,
      account_number,
      amount,
      narration,
      currency,
      reference,
      callback_url,
      debit_currency,
      phoneNumber,
      email,
    } = req.body;

    const transferData = JSON.stringify({
      'account_bank': account_bank,
      'account_number': account_number,
      'amount': amount,
      'narration': narration,
      'currency': currency,
      'reference': reference,
      'callback_url': callback_url,
      'debit_currency': debit_currency,
      'meta': {
        'email': email,
        'mobile_number': phoneNumber,
      },
    });
    console.log(transferData);
    // const config = {
    // headers: {
    // 'Content-Type': 'application/json',
    // 'Accept': 'application/json',
    // 'Authorization': `${process.env.FLUTTERWAVE_V3_SECRET_LIVE_KEY}`,
    // },
    // };

    // const baseURL = 'https://api.flutterwave.com/v3/transfers';
    const config = {
      method: 'post',
      url: 'https://api.flutterwave.com/v3/transfers',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.FLUTTERWAVE_V3_SECRET_LIVE_KEY}`,
      },
      data: transferData,
    };

    // const example = await axios({
    // method: 'post',
    // url: '/user/12345',
    // data: {
    // firstName: 'Fred',
    // lastName: 'Flintstone',
    // },
    // });
    const preResponse = await axios(config);
    console.log(preResponse);
    const response = preResponse.data;
    const walletResponse = await getWithdrawResponse(response);
    return successResponse(res, {...walletResponse}, 201);
    // return res.status(200).json({
    // response,
    // });
  } catch (error) {
    errorResponse(res, {
      message: error.message,
    });
  }
};


export const getFundResponse = async (response) => {
  try {
    console.log(response);
    const {currency, id, amount} = response.data.data;
    const {status} = response.data.data;
    const {customer} = response.data.data.metadata;

    // check if transaction id already exist
    const transactionExist = await findTransactionBy({transactionId: id});

    if (transactionExist) {
      return ('Sorry, This Transaction Already Exists.');
    }

    // check if customer exist in our database
    const user = await findUserBy({email: customer.email});

    // check if user have a wallet, else create wallet
    await validateUserWallet(user.id);

    // create wallet transaction
    const walletTransaction = await createWalletTransaction(user.id, status, currency, amount);

    // create transaction
    const transaction = await createTransaction(user.id, id, status, currency, amount, customer);

    const wallet = await updateWallet(user.id, amount);

    return ({
      response: 'wallet funded successfully',
      data: wallet,
      walletTransaction,
      transaction,
    });

    // successResponse(res, {...wallets}, 201);
  } catch (error) {
    errorResponse(res, {
      message: error.message,
    });
  }
};

/**
 * Get payment response modal
 *
 * @param {Request} req The request from the endpoint.
 * @param {Response} res The response returned by the method.
 * @param {Response} next The response returned by the method.
 * @memberof WalletController
 * @return {JSON} A JSON response with the registered
 *  wallet's details and a JWT.
 */
export const getFundResponsePaystack = async (req, res, next) => {
  try {
    const {reference} = req.query;
    // URL with transaction ID of which will be used to confirm
    //  transaction status
    const url = `https://api.paystack.co/transaction/verify/${reference}`;
    // Network call to confirm transaction status
    const response = await axios({
      url,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.PAYSTACK_PRIVATE_KEY}`,
      },
    });
    console.log(response.data);

    const {currency, id, amount, status} = response.data.data;
    const {customer} = response.data.data.metadata;

    // check if transaction id already exist
    const transactionExist = await findTransactionBy({transactionId: id});

    if (transactionExist) {
      return res.status(409).send('Sorry, This Transaction Already Exists.');
    }

    // check if customer exist in our database
    const user = await findUserBy({email: customer.email});

    // check if user have a wallet, else create wallet
    await validateUserWallet(user.id);

    // create wallet transaction
    const walletTransaction = await createWalletTransaction(user.id, status, currency, amount);

    // create transaction
    const transaction = await createTransaction(user.id, id, status, currency, amount, customer);

    const wallet = await updateWallet(user.id, amount);

    return res.status(200).json({
      response: 'wallet funded successfully',
      data: wallet,
      walletTransaction,
      transaction,
    });

    // successResponse(res, {...wallets}, 201);
  } catch (error) {
    errorResponse(res, {
      message: error.message,
    });
  }
};

/**
 * Get payment response modal
 *
 * @param {Request} req The request from the endpoint.
 * @param {Response} res The response returned by the method.
 * @param {Response} next The response returned by the method.
 * @memberof WalletController
 * @return {JSON} A JSON response with the registered
 *  wallet's details and a JWT.
 */
export const getFundResponseFlutter = async (req, res, next) => {
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

    const {currency, id, amount, customer} = response.data.data;
    const {status} = response.data.data;

    // check if transaction id already exist
    const transactionExist = await findTransactionBy({transactionId: id});

    if (transactionExist) {
      return res.status(409).send('Sorry, This Transaction Already Exists.');
    }

    // check if customer exist in our database
    const user = await findUserBy({email: customer.email});

    // check if user have a wallet, else create wallet
    await validateUserWallet(user.id);

    // create wallet transaction
    const walletTransaction = await createWalletTransaction(user.id, status, currency, amount);

    // create transaction
    const transaction = await createTransaction(user.id, id, status, currency, amount, customer);

    const wallet = await updateWallet(user.id, amount);

    return res.status(200).json({
      response: 'wallet funded successfully',
      data: wallet,
      walletTransaction,
      transaction,
    });

    // successResponse(res, {...wallets}, 201);
  } catch (error) {
    errorResponse(res, {
      message: error.message,
    });
  }
};

// get withdraw response
const getWithdrawResponse = async (response) => {
  try {
    // const {transaction_id} = req.query;

    // URL with transaction ID of which will be used to confirm
    //  transaction status
    // const url = `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`;

    // Network call to confirm transaction status
    // const response = await axios({
    // url,
    // method: 'post',
    // headers: {
    // 'Content-Type': 'application/json',
    // 'Accept': 'application/json',
    // 'Authorization': `${process.env.FLUTTERWAVE_V3_SECRET_KEY}`,
    // },
    // });

    console.log(response);

    const {currency, id, amount} = response.data;
    const {metadata} = response.data.recipient;
    const {status} = response.data;

    // check if transaction id already exist
    const transactionExist = await findTransactionBy({transactionId: id});

    if (transactionExist) {
      return 'Sorry, This Transaction Already Exists.';
    }

    // check if customer exist in our database
    const user = await findUserBy({email: metadata.email});

    // check if user have a wallet, else create wallet
    const wallet = await validateUserWallet(user.id);

    if (Number(wallet.balance) < amount) {
      return ({
        status: false,
        // statusCode: 400,
        message: `User ${user.id} has insufficient balance. Please try to withdraw a lower 
        amount.`,
      });
    }

    // create wallet transaction
    const debitWalletTransaction = await createDebitWalletTransaction(user.id, currency, amount);

    // create transaction
    const debitTransaction = await createDebitTransaction(user.id, id, status, currency, amount, user);

    const walletNew = await deductWallet(user.id, amount);

    return ({
      response: 'wallet debited successfully',
      walletNew,
      debitWalletTransaction,
      debitTransaction,
    });

    // successResponse(res, {...wallets}, 201);
  } catch (error) {
    errorResponse(res, {
      message: error.message,
    });
  }
};

/**
 * Get all wallets
 *
 * @param {Request} req The request from the endpoint.
 * @param {Response} res The response returned by the method.
 * @param {Response} next The response returned by the method.
 * @memberof WalletController
 * @return {JSON} A JSON response with the registered
 *  wallet's details and a JWT.
 */
export const getAllWallets = async (req, res, next) => {
  try {
    const wallets = await Wallet.findAll({});

    return res.status(200).json({
      success: true,
      wallets,
    });

    successResponse(res, {...wallets}, 201);
  } catch (error) {
    errorResponse(res, {
      message: error.message,
    });
  }
};

/**
 * Creates a new Wallet.
 *
 * @param {Request} req The request from the endpoint.
 * @param {Response} res The response returned by the method.
 * @memberof BusinnessController
 * @return {JSON} A JSON response with the created Wallet's details.
 */
export const addWallet = async (req, res) => {
  try {
    const id= req.user.id;
    // const userId = req.user.id;

    const walletExists = await findWalletBy({userId: id});
    if (walletExists) {
      return res.status(409).json({
        status: false,
        message: 'Wallet already exists',
      });
    }

    const result = await createWallet({id});
    console.log(result);
    return res.status(201).json({
      status: true,
      message: 'Wallet created successfully',
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      status: true,
      message: `Unable to create wallet. Please try again. \n Error: ${err}`,
    });
  }
};


/**
  * Gets a wallet profile after registeration or sign-in.
  *
  * @static
  * @param {Request} req - The request from the endpoint.
  * @param {Response} res - The response returned by the method.
  * @return { JSON } A JSON response with the wallet's profile details.
  * @memberof WalletController
  */
export const walletProfile = async (req, res) => {
  try {
    const id = req.params.walletId;
    const wallet = await findWalletBy({id});
    const walletResponse = extractWalletData(wallet);
    successResponse(res, walletResponse, 200);
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};

/**
 * Updates a wallet profile (admin)
 *

 * @param {Request} req - The request from the endpoint.
 * @param {Response} res - The response returned by the method.
 * @return { JSON } A JSON response with the new wallet's profile update.
 * @memberof WalletController
 */
export const updateWalletProfile = async (req, res) => {
  try {
    const id = req.params.walletId;
    const wallet = await updateWalletBy(req.body, {id});
    const walletResponse = extractWalletData(wallet);
    successResponse(res, walletResponse, 200);
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};

/**
 * Updates a wallet profile.
 *

 * @param {Request} req - The request from the endpoint.
 * @param {Response} res - The response returned by the method.
 * @return { JSON } A JSON response with the new wallet's profile update.
 * @memberof WalletController
 */
export const updateMyWalletProfile = async (req, res) => {
  try {
    const wallet = await findWalletBy({userId: req.user.id});
    const id = wallet.id;
    const newWallet = await updateWalletBy(req.body, {id});
    const walletResponse = extractWalletData(newWallet);
    successResponse(res, walletResponse, 200);
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};


/**
  * Deletes a wallet on a travel request.
  *
  * @param {Request} req - The request from the endpoint.
  * @param {Response} res - The response returned by the method.
  * @return { JSON } A JSON response containing with an empty data object.
  * @memberof WalletController
  */
export const deleteWallet = async (req, res) => {
  try {
    const walletId = req.params.walletId;
    const rowDeleted = await deleteWalletById(walletId);
    if (!rowDeleted) return errorResponse(res, {});
    successResponse(res, {id: walletId}, 200);
  } catch (err) {
    errorResponse(res, {});
  }
};

/**
  * Deletes a wallet on a travel request.
  *
  * @param {Request} req - The request from the endpoint.
  * @param {Response} res - The response returned by the method.
  * @return { JSON } A JSON response containing with an empty data object.
  * @memberof WalletController
  */
export const deleteMyWalletAccount = async (req, res) => {
  try {
    const wallet = await findWalletBy({userId: req.user.id});
    const walletId = wallet.id;
    const rowDeleted = await deleteWalletById(walletId);
    if (!rowDeleted) return errorResponse(res, {});
    successResponse(res, {
      code: 200, message:
                'Account Deleted Successfully.',
    }, 200);
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
export const getMyWalletDetails = async (req, res, next) => {
  try {
    const id = req.params.userId;
    // check if user have a wallet, else create wallet
    const userWallet = await findWalletBy({userId: id});
    // If user wallet doesn't exist, create a new one
    if (!userWallet) {
    // create wallet
      const wallet = await createWallet({
        id,
      });
      return wallet;
    }
    // return userWallet;
    const response = extractWalletData(userWallet);
    return successResponse(res, {...response});
  } catch (error) {
    return errorResponse(res, {});
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
        amount: Number(amount)/100,
        userId,
        isInflow: true,
        balanceBefore: Number(wallet.balance),
        balanceAfter: Number(wallet.balance) + Number(amount)/100,
        currency,
        status: 'successful',
      });
      return walletTransaction;
    } catch (error) {
      console.log(error);
      //  errorResponse(res, {
      //    message: error.message,
      //  });
    }
  };

// Create Wallet Transaction
const createDebitWalletTransaction =
  async (userId, status, currency, amount) => {
    try {
      const wallet = await findWalletBy({userId});
      // create wallet transaction
      const walletTransaction = await addWalletTransaction({
        amount: Number(amount)/100,
        userId,
        isInflow: false,
        balanceBefore: Number(wallet.balance),
        balanceAfter: Number(wallet.balance) - Number(amount)/100,
        currency,
        status: 'successful',
      });
      return walletTransaction;
    } catch (error) {
      console.log(error);
      //  errorResponse(res, {
      //    message: error.message,
      //  });
    }
  };


// Create Transaction
const createTransaction = async (
    userId,
    id,
    status,
    currency,
    amount,
    customer,
) => {
  try {
    const wallet = await findWalletBy({userId});
    // create transaction
    const transaction = await addTransaction({
      userId,
      transactionId: id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      amount: Number(amount)/100,
      currency,
      balanceBefore: Number(wallet.balance),
      balanceAfter: Number(wallet.balance) + Number(amount)/100,
      paymentStatus: status,
      paymentGateway: 'paystack',
    });
    return transaction;
  } catch (error) {
    console.log(error);
    // errorResponse(res, {
    //   message: error.message,
    // });
  }
};

// Create Transaction
const createDebitTransaction = async (
    userId,
    id,
    status,
    currency,
    amount,
    customer,
) => {
  try {
    const wallet = await findWalletBy({userId});
    // create transaction
    const transaction = await addTransaction({
      userId,
      transactionId: id,
      name: customer.firstName+' '+customer.lastName,
      email: customer.email,
      phone: customer.phoneNumber,
      amount: Number(amount)/100,
      currency,
      balanceBefore: Number(wallet.balance),
      balanceAfter: Number(wallet.balance) - Number(amount)/100,
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

// Update wallet
const updateWallet = async (userId, amount) => {
  try {
    // update wallet
    const wallet = await findWalletBy({userId});
    const increment = Number(amount)/100;
    const newWallet = await wallet.increment(
        'balance', {by: increment},
    );
    return newWallet;
  } catch (error) {
    console.log(error);
    // errorResponse(res, {
    //   message: error.message,
    // });
  }
};

// Update wallet
const deductWallet = async (userId, amount) => {
  try {
    // update wallet
    const wallet = await findWalletBy({userId});
    const decrement = Number(amount)/100;
    const newWallet = await wallet.decrement(
        'balance', {by: decrement},
    );
    return newWallet;
  } catch (error) {
    console.log(error);
    // errorResponse(res, {
    //   message: error.message,
    // });
  }
};

/**
 * Create Transfer
 *
 * @param {Request} req The request from the endpoint.
 * @param {Response} res The response returned by the method.
 * @memberof WalletController
 * @return {JSON} A JSON response with the registered
 *  wallet's details for both sender and recipient.
 */
export const transfer = async (req, res) => {
  try {
    const {toUserId, fromUserId, amount, summary} = req.body;
    const reference = v4();
    if (!toUserId && !fromUserId && !amount && !summary) {
      return res.status(400).json({
        status: false,
        message: 'Please provide the following details: toUserId, fromUserId, amount, summary',
      });
    }

    const transferResult = await Promise.all([
      debitAccount(
          {amount, userId: fromUserId, purpose: 'transfer', reference, summary,
            trnxSummary: `TRFR TO: ${toUserId}. TRNX REF:${reference} `}),
      creditAccount(
          {amount, userId: toUserId, purpose: 'transfer', reference, summary,
            trnxSummary: `TRFR FROM: ${fromUserId}. TRNX REF:${reference} `}),
    ]);

    const failedTxns = transferResult.filter((result) => result.status !== true);
    if (failedTxns.length) {
      const errors = failedTxns.map((a) => a.message);
      return res.status(400).json({
        status: false,
        message: errors,
      });
    }

    return res.status(201).json({
      status: true,
      message: 'Transfer successful',
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: `Unable to find perform transfer. Please try again. \n Error: ${err}`,
    });
  }
};


