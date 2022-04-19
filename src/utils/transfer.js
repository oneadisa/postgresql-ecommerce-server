
import {}
  from '../utils/helpers';
import {
  findWalletBy,
} from '../services';
import db from '../database/models';
const {WalletTransfer} = db;


export const creditAccount =
 async ({amount, userId, purpose, reference, summary,
   trnxSummary}) => {
   const wallet = await findWalletBy({userId});
   if (!wallet) {
     return {
       status: false,
       statusCode: 404,
       message: `User ${userId} doesn\'t exist.
       Please sign up or login.`,
     };
   };
   // update wallet
   const updatedWallet = await wallet.increment(
       'balance', {by: amount},
   );


   const transaction = await WalletTransfer.create({
     trnxType: 'CR',
     purpose,
     amount,
     userId,
     reference,
     balanceBefore: Number(wallet.balance),
     balanceAfter: Number(wallet.balance) + Number(amount),
     summary,
     trnxSummary,
   });

   console.log(`Credit successful`);
   return {
     status: true,
     statusCode: 201,
     message: 'Credit successful',
     data: {updatedWallet, transaction},
   };
 };

export const debitAccount =
 async ({amount, userId, purpose, reference, summary,
   trnxSummary}) => {
   const wallet = await findWalletBy({userId});
   if (!wallet) {
     return {
       status: false,
       statusCode: 404,
       message: `User ${userId} doesn\'t exist.
Please sign up or login.`,
     };
   };

   if (Number(wallet.balance) < amount) {
     return {
       status: false,
       statusCode: 400,
       message: `User ${userId} has insufficient balance`,
     };
   }
   // update wallet
   const updatedWallet = await wallet.decrement(
       'balance', {by: amount},
   );
   const transaction = await WalletTransfer.create({
     trnxType: 'DR',
     purpose,
     amount,
     userId,
     reference,
     balanceBefore: Number(wallet.balance),
     balanceAfter: Number(wallet.balance) - Number(amount),
     summary,
     trnxSummary,
   });

   console.log(`Debit successful`);
   return {
     status: true,
     statusCode: 201,
     message: 'Debit successful',
     data: {updatedWallet, transaction},
   };
 };

export const creditRepaymentAccount =
 async ({amount, userId, purpose, reference, summary,
   trnxSummary}) => {
   const wallet = await findWalletBy({userId});
   if (!wallet) {
     return {
       status: false,
       statusCode: 404,
       message: `User ${userId} doesn\'t exist.
       Please sign up or login.`,
     };
   };
   // update wallet
   const updatedWallet = await wallet.increment(
       'balance', {by: amount},
   );


   const transaction = await WalletTransfer.create({
     trnxType: 'CR',
     purpose,
     amount,
     userId,
     reference,
     balanceBefore: Number(wallet.balance),
     balanceAfter: Number(wallet.balance) + Number(amount),
     summary,
     trnxSummary,
   });

   console.log(`Credit successful`);
   return {
     status: true,
     statusCode: 201,
     message: 'Credit successful',
     data: {updatedWallet, transaction},
   };
 };

export const debitRepaymentAccount =
 async ({amount, userId, purpose, reference, summary,
   trnxSummary}) => {
   const wallet = await findWalletBy({userId});
   if (!wallet) {
     return {
       status: false,
       statusCode: 404,
       message: `User ${userId} doesn\'t exist.
Please sign up or login.`,
     };
   };

   //  if (Number(wallet.balance) < amount) {
   //  return {
   //  status: false,
   //  statusCode: 400,
   //  message: `User ${userId} has insufficient balance`,
   //  };
   //  }
   //  update wallet
   const updatedWallet = await wallet.decrement(
       'balance', {by: amount},
   );
   const transaction = await WalletTransfer.create({
     trnxType: 'DR',
     purpose,
     amount,
     userId,
     reference,
     balanceBefore: Number(wallet.balance),
     balanceAfter: Number(wallet.balance) - Number(amount),
     summary,
     trnxSummary,
   });

   console.log(`Debit successful`);
   return {
     status: true,
     statusCode: 201,
     message: 'Debit successful',
     data: {updatedWallet, transaction},
   };
 };
