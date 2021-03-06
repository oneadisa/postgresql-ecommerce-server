import {Router as expressRouter} from 'express';
import {
  deleteProductReviewAction, updateProductReviewProfile, addProductReview,
  getMyProductReviewDetails, getProductReviewDetails, getAllProductReviews,
  getProductRatingProduct, getMyStoreProductReviews,
  getProductReviewsProduct, getProductReviewDetailsUser} from '../controllers';
import {protect, onProductReviewCreation} from '../middlewares';


const router = expressRouter();

router.route('/all').get(getAllProductReviews);

router
    .route('/create')
    .post(onProductReviewCreation, addProductReview);

router.get('/me', protect, getMyProductReviewDetails);
router.get('/me/profile/:userId', getProductReviewDetailsUser);

router.get('/one/review/:productReviewId', getProductReviewDetails);
router.put('/one/update/:productReviewId', updateProductReviewProfile);
router.delete('/one/delete/:productReviewId',
    deleteProductReviewAction);

router.get('/admin/review/:productReviewId', getProductReviewDetails);
router.put('/admin/update/:productReviewId', updateProductReviewProfile);
router.delete('/admin/delete/:productReviewId',
    deleteProductReviewAction);

router.get('/one/product/:productId', getProductReviewsProduct);
router.get('/one/rating/:productId', getProductRatingProduct);
router.get('/me/owner/:ownerId', getMyStoreProductReviews);

export default router;
