import {Router as expressRouter} from 'express';
import {fund, getFundResponse, walletBalance,
  getMyWalletDetails, addWallet, transfer,
  // getWithdrawResponse,
  getFundResponsePaystack,
  webhook,
  withdrawFlutter,
  withdraw, fw,
} from '../controllers';
// import {protect} from '../middlewares';


const router = expressRouter();

router.post('/my/webhook/url', webhook);
router
    .route('/fund')
    .post(fund);
router.post('/withdraw', withdraw);
router.post('/withdraw/flutter', withdrawFlutter);
router.get('/one/:userId/balance', walletBalance);
router.get('/fund/response', getFundResponsePaystack);
router.get('/fund/response/one', getFundResponse);
router.get('/fw', fw);
// router.post('/withdraw/response', getWithdrawResponse);
router.get('/me/:userId', getMyWalletDetails);
router.post('/new', addWallet);


router.post('/transfer', transfer);
//
// router.get('/admin/profile/:userId', userProfile);
// router.put('/admin/update/:userId', updateProfile);
// router.delete('/admin/delete/:userId', protect, deleteUser);
export default router;

// const axios = require('axios');
// const data = JSON.stringify({
//   'length': 7,
//   'customer': {
//     'name': 'Flutterwave Developers',
//     'email': 'developers@flutterwavego.com',
//     'phone': '2348000000000',
//   },
//   'sender': 'Flutterwave Inc.',
//   'send': true,
//   'medium': [
//     'email',
//     'whatsapp',
//   ],
//   'expiry': 5,
// });

// const config = {
//   method: 'post',
//   url: 'https://api.flutterwave.com/v3/otps',
//   headers: {
//     'Authorization': 'Bearer FLWSECK_TEST-SANDBOXDEMOKEY-X',
//     'Content-Type': 'application/json',
//   },
//   data: data,
// };

// axios(config)
//     .then(function(response) {
//       console.log(JSON.stringify(response.data));
//     })
//     .catch(function(error) {
//       console.log(error);
//     });

// const request = require('request');
// const options = {
//   method: 'PUT',
//   url: 'https://api.flutterwave.com/v3/chargebacks/122',
//   headers: {
//     'Authorization': 'FLWSECK_TEST-SANDBOXDEMOKEY-X',
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({
//     action: 'accept',
//     comment: 'Service rendered',
//   }),
// };
// request(options, function(error, response) {
//   if (error) throw new Error(error);
//   console.log(response.body);
// });


