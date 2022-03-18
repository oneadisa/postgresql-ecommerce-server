import {Router as expressRouter} from 'express';

import authRoute from './authRoute';
import businessRoute from './businessRoute';
import userRoute from './userRoute';

const router = expressRouter();

router.use('/auth', authRoute);
router.use('/business', businessRoute);
router.use('/user', userRoute);

export default router;
