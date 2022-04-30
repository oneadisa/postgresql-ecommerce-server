import {Router as expressRouter} from 'express';
import {getUserProfile, userSignup,
  verifyEmail, sendResetPasswordEmail, resetPassword,
  verifyPasswordResetLink, loginUser, logout,
  forgotPassword,
  updatePasswordOne,
} from '../controllers';
import {onUserSignup} from '../middlewares';
import {protect} from '../middlewares';

const router = expressRouter();

router.post('/user/signup', onUserSignup, userSignup);
router.get('/user/:userId/profile', getUserProfile);
router.post('/login', loginUser);
router.get('/logout', logout);


router.get('/verify', verifyEmail);
router.post('/reset-password/', sendResetPasswordEmail);
router.get('/reset-password', verifyPasswordResetLink);
router.post('/password/reset/:email', resetPassword);

router.route('/password/forgot').post(forgotPassword);

router.route('/password/reset/:token').put(resetPassword);

router.route('/password/update').put(protect, updatePasswordOne);

// router.route('/password/reset/:token').put(resetPassword);
// router.route('/password/update').put(authenticate, updatePassword);
// router.route('/password/forgot').post(forgotPassword);


export default router;
