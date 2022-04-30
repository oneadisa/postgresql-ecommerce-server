import {Router as expressRouter} from 'express';
import {
  deleteProductImageAction, updateProductImageProfile, addProductImage,
  getMyProductImageDetails, getProductImageDetails, getAllProductImages,
  getProductImagesProduct, getProductImageDetailsUser} from '../controllers';
import {protect, onProductImageCreation} from '../middlewares';


const router = expressRouter();

router.route('/all').get(getAllProductImages);

router
    .route('/create')
    .post(protect, onProductImageCreation, addProductImage);

router.get('/me', protect, getMyProductImageDetails);
router.get('/me/profile/:userId', protect, getProductImageDetailsUser);

router.get('/one/image/:productImageId', getProductImageDetails);
router.put('/one/update/:productImageId', updateProductImageProfile);
router.delete('/one/delete/:productImageId', protect,
    deleteProductImageAction);

router.get('/admin/image/:productImageId', getProductImageDetails);
router.put('/admin/update/:productImageId', updateProductImageProfile);
router.delete('/admin/delete/:productImageId',
    deleteProductImageAction);

router.get('/one/product/:productId', getProductImagesProduct);

export default router;
