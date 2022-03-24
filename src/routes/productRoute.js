import {Router as expressRouter} from 'express';
import {
  deleteProductAction, updateProductProfile, addProduct,
  getMyProductDetails, getProductDetails, getAllProducts,
  updateMyProductProfile, deleteMyProductAccount,
} from '../controllers';
import {protect, onProductCreation} from '../middlewares';


const router = expressRouter();

router.route('/all').get(getAllProducts);

router
    .route('/create')
    .post(protect, onProductCreation, addProduct);

router.put('/me/update', protect, updateMyProductProfile);
router.get('/me', protect, getMyProductDetails);
router.delete('/me/delete', protect, deleteMyProductAccount);

router.get('/admin/profile/:productId', getProductDetails);
router.put('/admin/update/:productId', updateProductProfile);
router.delete('/admin/delete/:productId', protect, deleteProductAction);

export default router;
