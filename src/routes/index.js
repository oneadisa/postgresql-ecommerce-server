import {Router as expressRouter} from 'express';

import authRoute from './authRoute';
import businessRoute from './businessRoute';

const router = expressRouter();

router.use('/auth', authRoute);
router.use('/business', businessRoute);

export default router;
