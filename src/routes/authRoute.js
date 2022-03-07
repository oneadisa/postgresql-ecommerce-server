import {Router as expressRouter} from 'express';
import {getUserProfile, userSignup} from '../controllers';
import {onUserSignup} from '../middlewares';

const router = expressRouter();

router.post('/user/signup', onUserSignup, userSignup);
router.get('/user/:userId/profile', getUserProfile);

export default router;
