import {Router as expressRouter} from 'express';
import {
  deleteCampaignAction, updateCampaignProfile, addCampaign,
  getMyCampaignDetails, getCampaignDetails, getAllCampaigns,
  getCampaignDetailsUser} from '../controllers';
import {protect,
// onCampaignCreation
} from '../middlewares';


const router = expressRouter();

router.route('/all').get(getAllCampaigns);

// router
// .route('/create')
// .post(onCampaignCreation, addCampaign);

router
    .route('/create')
    .post(addCampaign);

// router.put('/me/update', protect, updateMyCampaignProfile);
router.get('/me', protect, getMyCampaignDetails);
router.get('/me/profile/:userId', protect, getCampaignDetailsUser);
// router.delete('/me/delete', protect, deleteMyCampaignAccount);

router.get('/one/campaign/:campaignId', getCampaignDetails);
router.put('/one/update/:campaignId', updateCampaignProfile);
router.delete('/one/delete/:campaignId', protect,
    deleteCampaignAction);

router.get('/admin/campaign/:campaignId', getCampaignDetails);
router.put('/admin/update/:campaignId', updateCampaignProfile);
router.delete('/admin/delete/:campaignId',
    deleteCampaignAction);


export default router;
