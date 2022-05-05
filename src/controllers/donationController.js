/* eslint-disable camelcase */
/* eslint-disable max-len */
import {successResponse, errorResponse,
  extractDonationData} from '../utils/helpers';
import ApiError from '../utils/apiError';
import {createDonation, findDonationBy, findDonationsAndCountBy,
  updateDonationBy, findCampaignBy, findUserBy, findDonationsSum, findDebtSum,
  fetchAllDonations, deleteDonationById, findBusinessBy, createPayout,
  findTransactionBy,
} from '../services';
import {
  createWallet, findWalletBy,
  addWalletTransaction,
} from '../services';
const {creditRepaymentAccount, debitRepaymentAccount, debitAccount, creditAccount} = require( '../utils/transfer');
const {v4} = require('uuid');
// const path = require('path');
import axios from 'axios';

/**
           * Creates a new Donation from Payment portal.
           *
           * @param {Request} req The request from the endpoint.
           * @param {Response} res TheyId response returned by the method.
           * @memberof DonationController
           * @return {JSON} A JSON response with the created Donation's
           *  details.
           */
export const addDonationCash = async (req, res) => {
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

    const {
      campaignId,
      userId,
    } = response.data.data.meta;
    const user = await findUserBy({id: userId});
    const business = await findBusinessBy({userId});
    const campaign = await findCampaignBy({id: campaignId});
    const recipient = await findUserBy({id: campaign.userId});
    const campaignOwner = await findUserBy({id: campaign.userId});
    const campaignBusiness = await findBusinessBy({userId: campaign.userId});

    const repaymentTime = Math.abs(
        campaign.endDatePledgedProfit - campaign.endDate,
    );
    const numberOfRepayments = repaymentTime / campaign.timePerPayment;
    const numberOfTimesPaidAlready =
        repaymentTime / campaign.timePerPayment - numberOfRepayments;
    const amountRepay =
        Number(amount) +
        (campaign.pledgedProfitToLenders / 100) * Number(amount);
    const amountAlreadyRaise =
        (numberOfTimesPaidAlready *
          ((campaign.pledgedProfitToLenders / 100) * Number(amount))) /
        (repaymentTime / campaign.timePerPayment);

    const amountPerTime = amountRepay / (repaymentTime / campaign.timePerPayment);
    if (business) {
      const donationInfo = {
        amount,
        firstName: user.firstName,
        lastName: user.lastName,
        businessName: business.businessName,
        amountToBeRepaid: amountRepay,
        type: campaign.fundingType,
        amountToBeRepaidPerTime: amountPerTime,
        amountAlreadyRepaid: amountAlreadyRaise,
        firstPaymentDate: campaign.firstPaymentDate,
        lastPaymentDate: campaign.endDatePledgedProfit,
        campaignName: campaign.campaignName,
        ownerLogo: campaign.ownerLogo,
        investorBrief: campaign.investorBrief,
        campaignId,
        recipientId: recipient.id,
        userId,
      };

      const payoutInfo = {
        amount: amountPerTime,
        firstName: campaignOwner.firstName,
        lastName: campaignOwner.lastName,
        businessName: campaignBusiness.businessName,
        amountToBeRepaid: amountRepay,
        type: campaign.fundingType,
        amountToBeRepaidPerTime: amountPerTime,
        amountAlreadyRepaid: amountAlreadyRaise,
        firstPaymentDate: campaign.firstPaymentDate,
        lastPaymentDate: campaign.endDatePledgedProfit,
        campaignName: campaign.campaignName,
        ownerLogo: campaign.ownerLogo,
        investorBrief: campaign.investorBrief,
        campaignId,
        recipientId: userId,
        userId,
      };
      // check if customer exist in our database
      // const recipient = await findUserBy({email: customer.email});
      // check if user have a wallet, else create wallet
      await validateUserWallet(recipient.id);
      // create wallet transaction
      const walletTransaction = await createWalletTransaction(recipient.id, status, currency, amount);
      // create transaction
      await createTransaction(recipient.id, id, status, currency, amount, customer);
      await updateWallet(recipient.id, amount);
      const donation = await createDonation(donationInfo);
      let counter = 1;
      const payoutDelay = campaign.endDate - new Date().getTime();

      const newPayout = async () => {
        const reference = v4();
        const summary = 'Loan Repayment';
        // check if owner has a wallet, else create wallet
        await validateUserWallet(userId);
        await Promise.all([
          debitRepaymentAccount(
              {
                amountPerTime, userId: recipient.id, purpose: 'Repayment to investor', reference, summary,
                trnxSummary: `TRFR TO: ${userId}. TRNX REF:${reference} `,
              }),
          creditRepaymentAccount(
              {
                amountPerTime, userId: userId, purpose: `Return on investment in ${campaign.campaignName}`, reference, summary,
                trnxSummary: `TRFR FROM: ${recipient.id}. TRNX REF:${reference} `,
              }),
        ]);
        createPayout(payoutInfo);
        console.log('Payout number ' + counter);
        if (counter < numberOfRepayments) {
          counter++;
          setTimeout(newPayout, campaign.timePerPayment);
        }
      };
      const triggerPayout = () => setTimeout(
          newPayout
          , payoutDelay);
      await triggerPayout();
      return res.status(200).json({
        success: true,
        donation,
        walletTransaction,
      });
      // successResponse(res, {...donation}, 201);
    } else {
      const donationInfo = {
        amount,
        firstName: user.firstName,
        lastName: user.lastName,
        amountToBeRepaid: amountRepay,
        type: campaign.fundingType,
        amountToBeRepaidPerTime: amountPerTime,
        amountAlreadyRepaid: amountAlreadyRaise,
        firstPaymentDate: campaign.firstPaymentDate,
        lastPaymentDate: campaign.endDatePledgedProfit,
        campaignName: campaign.campaignName,
        ownerLogo: campaign.ownerLogo,
        investorBrief: campaign.investorBrief,
        campaignId,
        recipientId: recipient.id,
        userId,
      };
      const payoutInfo = {
        amount: amountPerTime,
        firstName: campaignOwner.firstName,
        lastName: campaignOwner.lastName,
        businessName: campaignBusiness.businessName,
        amountToBeRepaid: amountRepay,
        type: campaign.fundingType,
        amountToBeRepaidPerTime: amountPerTime,
        amountAlreadyRepaid: amountAlreadyRaise,
        firstPaymentDate: campaign.firstPaymentDate,
        lastPaymentDate: campaign.endDatePledgedProfit,
        campaignName: campaign.campaignName,
        ownerLogo: campaign.ownerLogo,
        investorBrief: campaign.investorBrief,
        campaignId,
        recipientId: userId,
        userId,
      };
      // check if customer exist in our database
      // const recipient = await findUserBy({email: customer.email});
      // check if user have a wallet, else create wallet
      await validateUserWallet(recipient.id);
      // create wallet transaction
      const walletTransaction = await createWalletTransaction(recipient.id, status, currency, amount);
      // create transaction
      await createTransaction(recipient.id, id, status, currency, amount, customer);
      await updateWallet(recipient.id, amount);
      const donation = await createDonation(donationInfo);
      let counter = 1;
      const payoutDelay = campaign.endDate - new Date().getTime();

      const newPayout = async ()=> {
        const reference = v4();
        const summary = 'Loan Repayment';
        // check if owner has a wallet, else create wallet
        await validateUserWallet(userId);
        await Promise.all([
          debitRepaymentAccount(
              {amountPerTime, userId: recipient.id, purpose: 'Repayment to investor', reference, summary,
                trnxSummary: `TRFR TO: ${userId}. TRNX REF:${reference} `}),
          creditRepaymentAccount(
              {amountPerTime, userId: userId, purpose: `Return on investment in ${campaign.campaignName}`, reference, summary,
                trnxSummary: `TRFR FROM: ${recipient.id}. TRNX REF:${reference} `}),
        ]);
        createPayout(payoutInfo);
        console.log('Payout number ' +counter);
        if (counter < numberOfRepayments) {
          counter++;
          setTimeout(newPayout, campaign.timePerPayment);
        }
      };

      const triggerPayout = () => setTimeout( newPayout
          , payoutDelay);
      await triggerPayout();
      return res.status(200).json({
        success: true,
        donation,
        walletTransaction,
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
           * Creates a new Donation from wallet.
           *
           * @param {Request} req The request from the endpoint.
           * @param {Response} res TheyId response returned by the method.
           * @memberof DonationController
           * @return {JSON} A JSON response with the created Donation's
           *  details.
           */
export const addDonationWallet = async (req, res) => {
  try {
    const {
      amount,
      campaignId,
      userId,
    } = req.body;
    const user = await findUserBy({id: userId});
    const business = await findBusinessBy({userId});
    const campaign = await findCampaignBy({id: campaignId});
    const recipient = await findUserBy({id: campaign.userId});
    const campaignOwner = await findUserBy({id: campaign.userId});
    const campaignBusiness = await findBusinessBy({userId: campaign.userId});

    const repaymentTime = Math.abs(
        campaign.endDatePledgedProfit - campaign.endDate,
    );
    const numberOfRepayments = repaymentTime / campaign.timePerPayment;
    const numberOfTimesPaidAlready =
        repaymentTime / campaign.timePerPayment - numberOfRepayments;
    const amountRepay =
        Number(amount) +
        (campaign.pledgedProfitToLenders / 100) * Number(amount);
    const amountAlreadyRaise =
        (numberOfTimesPaidAlready *
          ((campaign.pledgedProfitToLenders / 100) * Number(amount))) /
        (repaymentTime / campaign.timePerPayment);

    const amountPerTime = amountRepay / (repaymentTime / campaign.timePerPayment);
    if (business) {
      const donationInfo = {
        amount,
        firstName: user.firstName,
        lastName: user.lastName,
        businessName: business.businessName,
        amountToBeRepaid: amountRepay,
        type: campaign.fundingType,
        amountToBeRepaidPerTime: amountPerTime,
        amountAlreadyRepaid: amountAlreadyRaise,
        firstPaymentDate: campaign.firstPaymentDate,
        lastPaymentDate: campaign.endDatePledgedProfit,
        campaignName: campaign.campaignName,
        ownerLogo: campaign.ownerLogo,
        investorBrief: campaign.investorBrief,
        campaignId,
        recipientId: recipient.id,
        userId,
      };

      const payoutInfo = {
        amount: amountPerTime,
        firstName: campaignOwner.firstName,
        lastName: campaignOwner.lastName,
        businessName: campaignBusiness.businessName,
        amountToBeRepaid: amountRepay,
        type: campaign.fundingType,
        amountToBeRepaidPerTime: amountPerTime,
        amountAlreadyRepaid: amountAlreadyRaise,
        firstPaymentDate: campaign.firstPaymentDate,
        lastPaymentDate: campaign.endDatePledgedProfit,
        campaignName: campaign.campaignName,
        ownerLogo: campaign.ownerLogo,
        investorBrief: campaign.investorBrief,
        campaignId,
        recipientId: userId,
        userId,
      };
      const reference = v4();
      const summary = `Investment in ${campaign.campaignName}`;
      const transfer = await Promise.all([
        debitAccount(
            {amount, userId: userId, purpose: `Investment in ${campaign.campaignName}`, reference, summary,
              trnxSummary: `TRFR TO: ${recipient.id}. TRNX REF:${reference} `}),
        creditAccount(
            {amount, userId: recipient.id, purpose: `Investment from user in ${campaign.campaignName}`, reference, summary,
              trnxSummary: `TRFR FROM: ${userId}. TRNX REF:${reference} `}),
      ]);
      const donation = await createDonation(donationInfo);
      let counter = 1;
      const payoutDelay = campaign.endDate - new Date().getTime();

      const newPayout = async () => {
        const reference = v4();
        const summary = 'Loan Repayment';
        // check if owner has a wallet, else create wallet
        await validateUserWallet(userId);
        await Promise.all([
          debitRepaymentAccount(
              {
                amountPerTime, userId: recipient.id, purpose: 'Repayment to investor', reference, summary,
                trnxSummary: `TRFR TO: ${userId}. TRNX REF:${reference} `,
              }),
          creditRepaymentAccount(
              {
                amountPerTime, userId: userId, purpose: `Return on investment in ${campaign.campaignName}`, reference, summary,
                trnxSummary: `TRFR FROM: ${recipient.id}. TRNX REF:${reference} `,
              }),
        ]);
        createPayout(payoutInfo);
        console.log('Payout number ' + counter);
        if (counter < numberOfRepayments) {
          counter++;
          setTimeout(newPayout, campaign.timePerPayment);
        }
      };

      const triggerPayout = () => setTimeout(
          newPayout
          , payoutDelay);

      await triggerPayout();
      return res.status(200).json({
        success: true,
        donation,
        transfer,
      });
      // successResponse(res, {...donation}, 201);
    } else {
      const donationInfo = {
        amount,
        firstName: user.firstName,
        lastName: user.lastName,
        amountToBeRepaid: amountRepay,
        type: campaign.fundingType,
        amountToBeRepaidPerTime: amountPerTime,
        amountAlreadyRepaid: amountAlreadyRaise,
        firstPaymentDate: campaign.firstPaymentDate,
        lastPaymentDate: campaign.endDatePledgedProfit,
        campaignName: campaign.campaignName,
        ownerLogo: campaign.ownerLogo,
        investorBrief: campaign.investorBrief,
        campaignId,
        recipientId: recipient.id,
        userId,
      };
      const payoutInfo = {
        amount: amountPerTime,
        firstName: campaignOwner.firstName,
        lastName: campaignOwner.lastName,
        businessName: campaignBusiness.businessName,
        amountToBeRepaid: amountRepay,
        type: campaign.fundingType,
        amountToBeRepaidPerTime: amountPerTime,
        amountAlreadyRepaid: amountAlreadyRaise,
        firstPaymentDate: campaign.firstPaymentDate,
        lastPaymentDate: campaign.endDatePledgedProfit,
        campaignName: campaign.campaignName,
        ownerLogo: campaign.ownerLogo,
        investorBrief: campaign.investorBrief,
        campaignId,
        recipientId: userId,
        userId,
      };
      const reference = v4();
      const summary = `Investment in ${campaign.campaignName}`;
      const transfer = await Promise.all([
        debitAccount(
            {amount, userId: userId, purpose: `Investment in ${campaign.campaignName}`, reference, summary,
              trnxSummary: `TRFR TO: ${recipient.id}. TRNX REF:${reference} `}),
        creditAccount(
            {amount, userId: recipient.id, purpose: `Investment from user in ${campaign.campaignName}`, reference, summary,
              trnxSummary: `TRFR FROM: ${userId}. TRNX REF:${reference} `}),
      ]);
      const donation = await createDonation(donationInfo);
      let counter = 1;
      const payoutDelay = campaign.endDate - new Date().getTime();

      const newPayout = async ()=> {
        const reference = v4();
        const summary = 'Loan Repayment';
        // check if owner has a wallet, else create wallet
        await validateUserWallet(userId);
        await Promise.all([
          debitRepaymentAccount(
              {amountPerTime, userId: recipient.id, purpose: 'Repayment to investor', reference, summary,
                trnxSummary: `TRFR TO: ${userId}. TRNX REF:${reference} `}),
          creditRepaymentAccount(
              {amountPerTime, userId: userId, purpose: `Return on investment in ${campaign.campaignName}`, reference, summary,
                trnxSummary: `TRFR FROM: ${recipient.id}. TRNX REF:${reference} `}),
        ]);
        createPayout(payoutInfo);
        console.log('Payout number ' +counter);
        if (counter < numberOfRepayments) {
          counter++;
          setTimeout(newPayout, campaign.timePerPayment);
        }
      };

      const triggerPayout = () => setTimeout( newPayout
          , payoutDelay);
      await triggerPayout();
      return res.status(200).json({
        success: true,
        donation,
        transfer,
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
           * Get all Donations
           *
           * @static
           * @param {Request} req - The request from the browser.
           * @param {Response} res - The response returned by the method.
           * @return { JSON } A JSON response all the created Donations.
           * @memberof DonationController
           */
export const getAllDonations = async (req, res) => {
  try {
    const Donations = await fetchAllDonations();

    return res.status(200).json({
      success: true,
      Donations,
    });
    successResponse(res, {...Donations}, 201);
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
           * @memberof DonationController
           */
export const getDonationDetails = async (req, res) => {
  try {
    const id = req.params.donationId;
    const Donation = await findDonationBy({id});
    const DonationResponse = extractDonationData(Donation);
    successResponse(res, DonationResponse, 200);
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};

/**
           * Updates a Donation profile (admin)
           *

           * @param {Request} req - The request from the endpoint.
           * @param {Response} res - The response returned by the method.
           * @param {Response} next - The response returned by the method.
           * @return { JSON } A JSON response with the new Donation's
           *  profile update.
           * @memberof DonationController
           */
export const updateDonationProfile= async (req, res, next) => {
  try {
    const id = req.params.donationId;
    const Donation = await findDonationBy({id});

    if (!Donation) {
      throw new ApiError(404, `Donation with id: ${id} does not exist`);
    } else if (Donation.DonationLiveStatus === 'false') {
      throw new ApiError(404, `This Donation has already ended.`);
    } else {
      const id = req.params.donationId;
      //   const Donation = await findDonationBy({id});
      // eslint-disable-next-line max-len
      // const newAmount = amountAlreadyRaised+Donation.amountAlreadyRaised;
      const updatedDonation = await updateDonationBy(req.body, {id});
      const DonationResponse = extractDonationData(updatedDonation);
      successResponse(res, DonationResponse, 200);
    }
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};


/**
              * Deletes a Donation on a travel request.
              *
              * @param {Request} req - The request from the endpoint.
              * @param {Response} res - The response returned by the method.
              * @return { JSON } A JSON response containing with an empty data
              *  object.
              * @memberof DonationController
              */
export const deleteDonationAction = async (req, res) => {
  try {
    const donationId = req.params.donationId;
    const rowDeleted = await deleteDonationById(donationId);
    if (!rowDeleted) return errorResponse(res, {});
    successResponse(res, {id: donationId}, 200);
  } catch (err) {
    errorResponse(res, {});
  }
};

/**
             *
             *  Get profile Donation details
             * @static
             * @param {Request} req - The request from the endpoint.
             * @param {Response} res - The response returned by the method.
             * @param {Response} next - The response returned by the method.
             * @memberof Auth
             */
export const getMyDonationDetails = async (req, res, next) => {
  try {
    const {count, rows} = await findDonationsAndCountBy({userId: req.user.id});
    // if (!rows) {
    // return errorResponse(res, {code: 401, message:
    // eslint-disable-next-line max-len
    // 'This user does not exist or is logged out. Please login or sign up.'});
    // }
    return res.status(200).json({
      success: true,
      count,
      rows,
    });
    successResponse(res, {...donations}, 201);
  } catch (error) {
    errorResponse(res, {});
  }
};

/**
             *
             *  Get profile Donation details
             * @static
             * @param {Request} req - The request from the endpoint.
             * @param {Response} res - The response returned by the method.
             * @param {Response} next - The response returned by the method.
             * @memberof Auth
             */
export const getMyDonationRecievedDetails = async (req, res, next) => {
  try {
    const {count, rows} = await findDonationsAndCountBy({recipientId: req.user.id});
    // if (!rows) {
    // return errorResponse(res, {code: 401, message:
    // eslint-disable-next-line max-len
    // 'This user does not exist or is logged out. Please login or sign up.'});
    // }
    return res.status(200).json({
      success: true,
      count, rows,
    });
    successResponse(res, {...Donations}, 201);
  } catch (error) {
    errorResponse(res, {});
  }
};

/**
             *
             *  Get profile Donation details
             * @static
             * @param {Request} req - The request from the endpoint.
             * @param {Response} res - The response returned by the method.
             * @param {Response} next - The response returned by the method.
             * @memberof Auth
             */
export const getMyDonationRecievedSum = async (req, res, next) => {
  try {
    const amount = await findDonationsSum({recipientId: req.user.id});
    if (!amount) {
      return errorResponse(res, {code: 401, message:
                    // eslint-disable-next-line max-len
                    'This user does not exist or is logged out. Please login or sign up.'});
    }
    return res.status(200).json({
      success: true,
      amount,
    });
    successResponse(res, {...Donations}, 201);
  } catch (error) {
    errorResponse(res, {});
  }
};

/**
             *
             *  Get profile Donation details
             * @static
             * @param {Request} req - The request from the endpoint.
             * @param {Response} res - The response returned by the method.
             * @param {Response} next - The response returned by the method.
             * @memberof Auth
             */
export const getMyDebtSum = async (req, res, next) => {
  try {
    const amount = await findDebtSum({recipientId: req.user.id});
    if (!amount) {
      return errorResponse(res, {code: 401, message:
                    // eslint-disable-next-line max-len
                    'This user does not exist or is logged out. Please login or sign up.'});
    }
    return res.status(200).json({
      success: true,
      amount,
    });
    successResponse(res, {...Donations}, 201);
  } catch (error) {
    errorResponse(res, {});
  }
};

/**
             *
             *  Get profile Donation details
             * @static
             * @param {Request} req - The request from the endpoint.
             * @param {Response} res - The response returned by the method.
             * @param {Response} next - The response returned by the method.
             * @memberof Auth
             */
export const getDonationDetailsUser = async (req, res, next) => {
  try {
    const {count, rows} = await findDonationsAndCountBy({userId: req.params.userId});
    // if (!Donations) {
    // return errorResponse(res, {code: 401, message:
    // eslint-disable-next-line max-len
    // 'This user does not exist or is logged out. Please login or sign up.'});
    // }
    return res.status(200).json({
      success: true,
      count,
      rows,
    });
    successResponse(res, {...Donations}, 201);
  } catch (error) {
    errorResponse(res, {});
  }
};

/**
             *
             *  Get profile Donation details
             * @static
             * @param {Request} req - The request from the endpoint.
             * @param {Response} res - The response returned by the method.
             * @param {Response} next - The response returned by the method.
             * @memberof Auth
             */
export const getDonationSumUser = async (req, res, next) => {
  try {
    const sum = await findDonationsSum({userId: req.params.userId});
    // if (!sum) {
    // return errorResponse(res, {code: 401, message:
    // eslint-disable-next-line max-len
    // 'This user does not exist or is logged out. Please login or sign up.'});
    // }
    return res.status(200).json({
      success: true,
      sum,
    });
    // successResponse(res, {...Donations}, 201);
  } catch (error) {
    errorResponse(res, {});
  }
};


/**
             *
             *  Get profile Donation details
             * @static
             * @param {Request} req - The request from the endpoint.
             * @param {Response} res - The response returned by the method.
             * @param {Response} next - The response returned by the method.
             * @memberof Auth
             */
export const getDonationRecievedDetailsUser = async (req, res, next) => {
  try {
    const {count, rows} = await findDonationsAndCountBy({recipientId: req.params.userId});
    // if (!rows) {
    //   return errorResponse(res, {code: 401, message:
    //                 // eslint-disable-next-line max-len
    //                 'This user does not exist or is logged out. Please login or sign up.'});
    // }
    return res.status(200).json({
      success: true,
      count, rows,
    });
    successResponse(res, {...Donations}, 201);
  } catch (error) {
    errorResponse(res, {});
  }
};

/**
             *
             *  Get profile Donation details
             * @static
             * @param {Request} req - The request from the endpoint.
             * @param {Response} res - The response returned by the method.
             * @param {Response} next - The response returned by the method.
             * @memberof Auth
             */
export const getDonationRecievedSumUser = async (req, res, next) => {
  try {
    const amount = await findDonationsSum({recipientId: req.params.userId});
    // if (!amount) {
    // return errorResponse(res, {code: 401, message:
    // eslint-disable-next-line max-len
    // 'This user does not exist or is logged out. Please login or sign up.'});
    // }
    return res.status(200).json({
      success: true,
      amount,
    });
    successResponse(res, {...Donations}, 201);
  } catch (error) {
    errorResponse(res, {});
  }
};

/**
             *
             *  Get profile Donation details
             * @static
             * @param {Request} req - The request from the endpoint.
             * @param {Response} res - The response returned by the method.
             * @param {Response} next - The response returned by the method.
             * @memberof Auth
             */
export const getDebtSumUser = async (req, res, next) => {
  try {
    const amount = await findDebtSum({recipientId: req.params.userId});
    // if (!amount) {
    // return errorResponse(res, {code: 401, message:
    // eslint-disable-next-line max-len
    // 'This user does not exist or is logged out. Please login or sign up.'});
    // }
    return res.status(200).json({
      success: true,
      amount,
    });
    successResponse(res, {...Donations}, 201);
  } catch (error) {
    errorResponse(res, {});
  }
};

/**
       * Get reviews that belong to a particular campaing.
       *
       * @static
       * @param {Request} req - The request from the browser.
       * @param {Response} res - The response returned by the method.
       * @return { JSON } A JSON response with the newly created booking.
       * @memberof CampaignReviewController
       */
export const getDonationsCampaign = async (req, res) => {
  try {
    const id = req.params.campaignId;
    const {count, rows} = await findDonationsAndCountBy({campaignId: id});
    return res.status(200).json({
      success: true,
      count,
      rows,
    });
    // successResponse(res, campaingReviews, 200);
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};

/**
       * Get reviews that belong to a particular campaing.
       *
       * @static
       * @param {Request} req - The request from the browser.
       * @param {Response} res - The response returned by the method.
       * @return { JSON } A JSON response with the newly created booking.
       * @memberof CampaignReviewController
       */
export const getDonationsSumCampaign = async (req, res) => {
  try {
    const id = req.params.campaignId;
    const amount = await findDonationsSum({campaignId: id});
    return res.status(200).json({
      success: true,
      amount,
    });
    // successResponse(res, campaingReviews, 200);
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};


/**
       * Get reviews that belong to a particular campaing.
       *
       * @static
       * @param {Request} req - The request from the browser.
       * @param {Response} res - The response returned by the method.
       * @return { JSON } A JSON response with the newly created booking.
       * @memberof CampaignReviewController
       */
export const getDebtCampaign = async (req, res) => {
  try {
    const id = req.params.campaignId;
    const amount = await findSumBy({campaignId: id});
    return res.status(200).json({
      success: true,
      amount,
    });
    // successResponse(res, campaingReviews, 200);
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
  }
};

/**
       * Get reviews that belong to a particular campaing.
       *
       * @static
       * @param {Request} req - The request from the browser.
       * @param {Response} res - The response returned by the method.
       * @return { JSON } A JSON response with the newly created booking.
       * @memberof CampaignReviewController
       */
export const getMyDonationsCampaign = async (req, res) => {
  try {
    const id = req.params.campaignId;
    const {count, rows} = await findDonationsAndCountBy({campaignId: id, userId: req.user.id});
    return res.status(200).json({
      success: true,
      count,
      rows,
    });
    // successResponse(res, campaingReviews, 200);
  } catch (error) {
    errorResponse(res, {code: error.statusCode, message: error.message});
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
      phone: customer.phone_number,
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


// let counter = 1;

// const newPayout = ()=> {
// console.log('Run No. ' +counter);
// if (counter < 5) {
// counter++;
// setTimeout(newPayout, 2000);
// }
// }

// const triggerPayout = () => setTimeout(newPayout, 5000);
// triggerPayout();

