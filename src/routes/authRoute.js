import {Router as expressRouter} from 'express';
import {userSignup} from '../controllers';
import {onUserSignup} from '../middlewares';

const router = expressRouter();

router.post('/user/signup', onUserSignup, userSignup);

export default router;
