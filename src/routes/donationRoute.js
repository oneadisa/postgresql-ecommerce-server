import {Router as expressRouter} from 'express';
import {
  deleteDonationAction, updateDonationProfile, addDonationWallet,
  addDonationCash,
  getMyDonationDetails, getMyDonationRecievedDetails, getDonationSumUser,
  getDonationDetails, getAllDonations, getMyDonationRecievedSum,
  getMyDebtSum, getDonationRecievedSumUser, getDebtSumUser,
  getDonationDetailsUser, getDonationRecievedDetailsUser,
  getMyDonationsCampaign,
  getDonationsCampaign, getDonationsSumCampaign, getDebtCampaign}
  from '../controllers';
import {protect, onDonationCreation} from '../middlewares';


const router = expressRouter();

router.route('/all').get(getAllDonations);

router
    .route('/wallet/create')
    .post(onDonationCreation, addDonationWallet);
router.get('/cash/create', addDonationCash);
router.get('/me', protect, getMyDonationDetails);
router.get('/me/donated', protect, getDonationSumUser);
router.get('/me/campaign', protect, getMyDonationRecievedDetails);
router.get('/me/raised', protect, getMyDonationRecievedSum);
router.get('/me/debt', protect, getMyDebtSum);
router.get('/me/profile/:userId', protect, getDonationDetailsUser);
router.get('/me/campaign/:userId', protect, getDonationRecievedDetailsUser);
router.get('/me/raised/:userId', protect, getDonationRecievedSumUser);
router.get('/me/debt/:userId', protect, getDebtSumUser);


router.get('/one/donation/:donationId', getDonationDetails);
router.put('/one/update/:donationId', updateDonationProfile);
router.delete('/one/delete/:donationId', protect,
    deleteDonationAction);

router.get('/admin/donation/:donationId', getDonationDetails);
router.put('/admin/update/:donationId', updateDonationProfile);
router.delete('/admin/delete/:donationId',
    deleteDonationAction);

router.get('/one/campaign/:campaignId', protect, getDonationsCampaign);
router.get('/one/raised/:campaignId', protect, getDonationsSumCampaign);
router.get('/one/debt/:campaignId', protect, getDebtCampaign);

router.get('/one/donation/:campaignId', protect, getMyDonationsCampaign);
export default router;
