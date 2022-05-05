import {Router as expressRouter} from 'express';
import {
  deletePayoutAction, updatePayoutProfile,
  getMyPayoutDetails, getMyPayoutRecievedDetails, getPayoutSumUser,
  getPayoutDetails, getAllPayouts, getMyPayoutRecievedSum,
  getMyDebtSum, getPayoutRecievedSumUser, getDebtSumUser,
  getPayoutDetailsUser, getPayoutRecievedDetailsUser,
  getMyPayoutsCampaign,
  getPayoutsCampaign, getPayoutsSumCampaign, getDebtCampaign}
  from '../controllers';
import {protect} from '../middlewares';


const router = expressRouter();

router.route('/all').get(getAllPayouts);

// router
// .route('/create')
// .post(onPayoutCreation, addPayout);

router.get('/me', protect, getMyPayoutDetails);
router.get('/me/donated', protect, getPayoutSumUser);
router.get('/me/campaign', protect, getMyPayoutRecievedDetails);
router.get('/me/raised', protect, getMyPayoutRecievedSum);
router.get('/me/debt', protect, getMyDebtSum);
router.get('/me/profile/:userId', getPayoutDetailsUser);
router.get('/me/campaign/:userId', getPayoutRecievedDetailsUser);
router.get('/me/raised/:userId', getPayoutRecievedSumUser);
router.get('/me/debt/:userId', getDebtSumUser);


router.get('/one/payout/:payoutId', getPayoutDetails);
router.put('/one/update/:payoutId', updatePayoutProfile);
router.delete('/one/delete/:payoutId',
    deletePayoutAction);

router.get('/admin/payout/:payoutId', getPayoutDetails);
router.put('/admin/update/:payoutId', updatePayoutProfile);
router.delete('/admin/delete/:payoutId',
    deletePayoutAction);

router.get('/one/campaign/:campaignId', getPayoutsCampaign);
router.get('/one/raised/:campaignId', getPayoutsSumCampaign);
router.get('/one/debt/:campaignId', getDebtCampaign);

router.get('/one/payout/:campaignId', getMyPayoutsCampaign);
export default router;
