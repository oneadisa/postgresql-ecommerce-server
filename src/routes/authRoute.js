import {Router as expressRouter} from 'express';
import {getUserProfile, userSignup,
  verifyEmail, sendResetPasswordEmail, resetPassword,
  verifyPasswordResetLink, loginUser, logout,
  forgotPassword, getUserDetails, updatePassword, updateProfile,
} from '../controllers';
import {onUserSignup, onUserLogin, isAuthenticatedUser} from '../middlewares';

const router = expressRouter();

router.post('/user/signup', onUserSignup, userSignup);
router.get('/user/:userId/profile', isAuthenticatedUser, getUserProfile);
router.post('/signup/user', onUserSignup, userSignup);
router.get('/verify', verifyEmail);
router.post('/login', onUserLogin, loginUser);
router.post('/reset-password/', sendResetPasswordEmail);
router.get('/reset-password', verifyPasswordResetLink);
router.post('/password/reset/:email', resetPassword);
router.get('/logout', logout);

router.route('/password/forgot').post(forgotPassword);

router.route('/password/reset/:token').put(resetPassword);

router.route('/logout').get(logout);

router.route('/me').get(isAuthenticatedUser, getUserDetails);

router.route('/password/update').put(isAuthenticatedUser, updatePassword);

router.route('/me/update').put(isAuthenticatedUser, updateProfile);


export default router;
