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
import payoutRoute from './payoutRoute';
import productImageRoute from './productImageRoute';
import walletRoute from './walletRoute';

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
router.use('/payout', payoutRoute);
router.use('/product/image', productImageRoute);
router.use('/wallet', walletRoute);


export default router;
