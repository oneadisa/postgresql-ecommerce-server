import {Router as expressRouter} from 'express';

import authRoute from './authRoute';

const router = expressRouter();

router.use('/auth', authRoute);

export default router;
