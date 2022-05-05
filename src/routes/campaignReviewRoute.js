import {Router as expressRouter} from 'express';
import {
  deleteCampaignReviewAction, updateCampaignReviewProfile, addCampaignReview,
  getMyCampaignReviewDetails, getCampaignReviewDetails, getAllCampaignReviews,
  getCampaignReviewsCampaign, getCampaignReviewDetailsUser}
  from '../controllers';
import {protect, onCampaignReviewCreation} from '../middlewares';


const router = expressRouter();

router.route('/all').get(getAllCampaignReviews);

router
    .route('/create')
    .post(onCampaignReviewCreation, addCampaignReview);

// router.put('/me/update', protect, updateMyCampaignReviewProfile);
router.get('/me', protect, getMyCampaignReviewDetails);
router.get('/me/profile/:userId', getCampaignReviewDetailsUser);
// router.delete('/me/delete', protect, deleteMyCampaignReviewAccount);

router.get('/one/review/:campaignReviewId', getCampaignReviewDetails);
router.put('/one/update/:campaignReviewId', updateCampaignReviewProfile);
router.delete('/one/delete/:campaignReviewId',
    deleteCampaignReviewAction);

router.get('/admin/review/:campaignReviewId', getCampaignReviewDetails);
router.put('/admin/update/:campaignReviewId', updateCampaignReviewProfile);
router.delete('/admin/delete/:campaignReviewId',
    deleteCampaignReviewAction);

router.get('/one/campaign/:campaignId', getCampaignReviewsCampaign);

export default router;
