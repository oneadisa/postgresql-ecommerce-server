import {Router as expressRouter} from 'express';
import {
  deleteStoreAction, updateStoreProfile, addStore,
  getMyStoreDetails, getStoreDetails, getAllStores,
  updateMyStoreProfile, deleteMyStoreAccount,
} from '../controllers';
import {protect, onStoreCreation} from '../middlewares';


const router = expressRouter();

router.route('/all').get(getAllStores);

router
    .route('/create')
    .post(protect, onStoreCreation, addStore);

router.put('/me/update', protect, updateMyStoreProfile);
router.get('/me', protect, getMyStoreDetails);
router.delete('/me/delete', protect, deleteMyStoreAccount);

router.get('/admin/profile/:storeId', getStoreDetails);
router.put('/admin/update/:storeId', updateStoreProfile);
router.delete('/admin/delete/:storeId', protect, deleteStoreAction);

export default router;
