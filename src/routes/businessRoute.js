import {Router as expressRouter} from 'express';
import {addBusiness, getAllBusinesses, businessProfile,
  updateBusinessProfile, updateMyBusinessProfile, deleteBusiness,
  deleteMyBusinessAccount, getMyBusinessDetails} from '../controllers';
import {onBusinessCreation} from '../middlewares';
import {protect} from '../middlewares';

const router = expressRouter();

router.post('/create', onBusinessCreation, addBusiness);
router
    .route('/all')
    .get(getAllBusinesses);

router.put('/me/update', protect, updateMyBusinessProfile);
router.get('/me/profile/:userId', getMyBusinessDetails);
router.delete('/me/delete', protect, deleteMyBusinessAccount);

router.get('/admin/profile/:businessId', businessProfile);
router.put('/admin/update/:businessId', updateBusinessProfile);
router.delete('/admin/delete/:businessId', deleteBusiness);

export default router;
