import {Router as expressRouter} from 'express';
import {
  deleteStoreAction, updateStoreProfile, addStore,
  getMyStoreDetails, getStoreDetails, getAllStores,
  updateMyStoreProfile, deleteMyStoreAccount,
  getStoreDetailsUser, getStoreProducts,
} from '../controllers';
import {protect, onStoreCreation} from '../middlewares';


const router = expressRouter();

router.route('/all').get(getAllStores);

router
    .route('/create')
    .post( onStoreCreation, addStore);

router.put('/me/update', protect, updateMyStoreProfile);
router.get('/me', protect, getMyStoreDetails);
router.get('/me/profile/:userId', getStoreDetailsUser);
router.delete('/me/delete', protect, deleteMyStoreAccount);

router.get('/one/products/:storeId', getStoreProducts);

router.get('/one/profile/:storeId', getStoreDetails);
router.put('/one/update/:storeId', updateStoreProfile);
router.delete('/one/delete/:storeId', protect, deleteStoreAction);

export default router;
