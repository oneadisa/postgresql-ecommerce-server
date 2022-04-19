import {Router as expressRouter} from 'express';
import {fund, getFundResponse, walletBalance,
  getMyWalletDetails, addWallet, transfer,
  getWithdrawResponse, withdraw,
} from '../controllers';
import {protect} from '../middlewares';


const router = expressRouter();

router
    .route('/fund')
    .get(fund);
router.post('/withdraw', withdraw);
router.get('/one/:userId/balance', walletBalance);
router.get('/fund/response', getFundResponse);
router.get('/withdraw/response', getWithdrawResponse);
router.get('/me/:userId', protect, getMyWalletDetails);
router.post('/new', protect, addWallet);


router.post('/transfer', transfer);
//
// router.get('/admin/profile/:userId', userProfile);
// router.put('/admin/update/:userId', updateProfile);
// router.delete('/admin/delete/:userId', protect, deleteUser);
export default router;
