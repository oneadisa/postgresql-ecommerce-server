import {Router as expressRouter} from 'express';
import {getUserProfile, userSignup,
  verifyEmail, sendResetPasswordEmail, resetPassword,
  verifyPasswordResetLink, loginUser, logout,
  getUserDetails,
} from '../controllers';
import {onUserSignup, authenticate} from '../middlewares';

const router = expressRouter();

router.post('/user/signup', onUserSignup, userSignup);
router.get('/user/:userId/profile', getUserProfile);
router.post('/login', loginUser);
router.get('/logout', logout);
router.route('/me').get(authenticate, getUserDetails);


router.get('/verify', verifyEmail);
router.post('/reset-password/', sendResetPasswordEmail);
router.get('/reset-password', verifyPasswordResetLink);
router.post('/password/reset/:email', resetPassword);

// router.route('/password/reset/:token').put(resetPassword);
// router.route('/password/update').put(authenticate, updatePassword);
// router.route('/password/forgot').post(forgotPassword);


export default router;
