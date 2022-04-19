import {Router as expressRouter} from 'express';
import {
  deletePayoutAction, updatePayoutProfile, addPayout,
  getMyPayoutDetails, getMyPayoutRecievedDetails, getPayoutSumUser,
  getPayoutDetails, getAllPayouts, getMyPayoutRecievedSum,
  getMyDebtSum, getPayoutRecievedSumUser, getDebtSumUser,
  getPayoutDetailsUser, getPayoutRecievedDetailsUser,
  getMyPayoutsCampaign,
  getPayoutsCampaign, getPayoutsSumCampaign, getDebtCampaign}
  from '../controllers';
import {protect, onPayoutCreation} from '../middlewares';


const router = expressRouter();

router.route('/all').get(getAllPayouts);

router
    .route('/create')
    .post(onPayoutCreation, addPayout);

router.get('/me', protect, getMyPayoutDetails);
router.get('/me/donated', protect, getPayoutSumUser);
router.get('/me/campaign', protect, getMyPayoutRecievedDetails);
router.get('/me/raised', protect, getMyPayoutRecievedSum);
router.get('/me/debt', protect, getMyDebtSum);
router.get('/me/profile/:userId', protect, getPayoutDetailsUser);
router.get('/me/campaign/:userId', protect, getPayoutRecievedDetailsUser);
router.get('/me/raised/:userId', protect, getPayoutRecievedSumUser);
router.get('/me/debt/:userId', protect, getDebtSumUser);


router.get('/one/payout/:payoutId', getPayoutDetails);
router.put('/one/update/:payoutId', updatePayoutProfile);
router.delete('/one/delete/:payoutId', protect,
    deletePayoutAction);

router.get('/admin/payout/:payoutId', getPayoutDetails);
router.put('/admin/update/:payoutId', updatePayoutProfile);
router.delete('/admin/delete/:payoutId',
    deletePayoutAction);

router.get('/one/campaign/:campaignId', protect, getPayoutsCampaign);
router.get('/one/raised/:campaignId', protect, getPayoutsSumCampaign);
router.get('/one/debt/:campaignId', protect, getDebtCampaign);

router.get('/one/payout/:campaignId', protect, getMyPayoutsCampaign);
export default router;
