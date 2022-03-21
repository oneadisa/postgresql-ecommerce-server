import {Router as expressRouter} from 'express';
import {
  getAllUsers, updateProfile, userProfile, updateMyProfile, getMyDetails,
} from '../controllers';
import {protect} from '../middlewares';


const router = expressRouter();

router
    .route('/all')
    .get(getAllUsers);

router.put('/me/update', protect, updateMyProfile);
router.get('/me', protect, getMyDetails);

router.get('/admin/profile/:userId', userProfile);
router.put('/admin/update/:userId', updateProfile);
export default router;
