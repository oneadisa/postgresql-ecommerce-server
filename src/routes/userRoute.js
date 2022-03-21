import {Router as expressRouter} from 'express';
import {
  getAllUsers, updateProfile, userProfile,
} from '../controllers';
import {isAuthenticated} from '../middlewares';


const router = expressRouter();

router
    .route('/all')
    .get(getAllUsers);

router.get('/profile/:userId', userProfile);
router.put('/profile/:userId', isAuthenticated, updateProfile);
export default router;
