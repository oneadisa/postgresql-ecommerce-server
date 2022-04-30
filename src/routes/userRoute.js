import {Router as expressRouter} from 'express';
import {
  getAllUsers, updateProfile, userProfile, updateMyProfile, getMyDetails,
  deleteUser, deleteMyAccount,
} from '../controllers';
import {protect} from '../middlewares';


const router = expressRouter();

router
    .route('/all')
    .get(getAllUsers);

router.put('/me/update', protect, updateMyProfile);
router.get('/me', protect, getMyDetails);
router.put('/me/delete', protect, deleteMyAccount);

router.get('/one/profile/:userId', userProfile);
router.put('/one/update/:userId', updateProfile);
router.delete('/one/delete/:userId', protect, deleteUser);
export default router;
