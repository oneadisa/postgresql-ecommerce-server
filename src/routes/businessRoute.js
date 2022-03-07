import {Router as expressRouter} from 'express';
import {addBusiness} from '../controllers';
import {onBusinessCreation} from '../middlewares';

const router = expressRouter();

router.post('/create', onBusinessCreation, addBusiness);

export default router;
