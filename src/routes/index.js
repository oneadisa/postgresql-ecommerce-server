import {Router as expressRouter} from 'express';

import authRoute from './authRoute';
import businessRoute from './businessRoute';
import userRoute from './userRoute';
import storeRoute from './storeRoute';
import productRoute from './productRoute';
import productReviewRoute from './productReviewRoute';
import orderRoute from './orderRoute';
import campaignRoute from './campaignRoute.js';
import campaignReviewRoute from './campaignReviewRoute.js';
import donation from './donationRoute';
import productImageRoute from './productImageRoute';

const router = expressRouter();

router.use('/auth', authRoute);
router.use('/business', businessRoute);
router.use('/user', userRoute);
router.use('/store', storeRoute);
router.use('/product', productRoute);
router.use('/product/review', productReviewRoute);
router.use('/order', orderRoute);
router.use('/campaign', campaignRoute);
router.use('/campaign/review', campaignReviewRoute);
router.use('/donation', donation);
router.use('/product/image', productImageRoute);


export default router;
