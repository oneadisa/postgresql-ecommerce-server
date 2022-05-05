import {Router as expressRouter} from 'express';
import {
  deleteProductAction, updateProductProfile, addProduct,
  getMyProductDetails, getProductDetails, getAllProducts,
  updateMyProductProfile, getProductDetailsUser,
  getProductStore,
} from '../controllers';
import {protect, onProductCreation} from '../middlewares';


const router = expressRouter();

router.route('/all').get(getAllProducts);

router
    .route('/create')
    .post(onProductCreation, addProduct);

router.put('/me/update', protect, updateMyProductProfile);
router.get('/me', protect, getMyProductDetails);
router.get('/me/profile/:userId', getProductDetailsUser);

router.get('/one/profile/:productId', getProductDetails);
router.get('/one/store/:productId', getProductStore);
router.put('/one/update/:productId', updateProductProfile);
router.delete('/one/delete/:productId', deleteProductAction);

router.get('/admin/profile/:productId', getProductDetails);
router.put('/admin/update/:productId', updateProductProfile);
router.delete('/admin/delete/:productId', deleteProductAction);

export default router;
