import {Router as expressRouter} from 'express';
import {
  deleteDonationAction, updateDonationProfile, addDonation,
  getMyDonationDetails, getDonationDetails, getAllDonations,
  getDonationDetailsUser} from '../controllers';
import {protect, onDonationCreation} from '../middlewares';


const router = expressRouter();

router.route('/all').get(getAllDonations);

router
    .route('/create')
    .post(onDonationCreation, addDonation);

router.get('/me', protect, getMyDonationDetails);
router.get('/me/profile/:userId', protect, getDonationDetailsUser);

router.get('/one/donation/:donationId', getDonationDetails);
router.put('/one/update/:donationId', updateDonationProfile);
router.delete('/one/delete/:donationId', protect,
    deleteDonationAction);

router.get('/admin/donation/:donationId', getDonationDetails);
router.put('/admin/update/:donationId', updateDonationProfile);
router.delete('/admin/delete/:donationId',
    deleteDonationAction);


export default router;
