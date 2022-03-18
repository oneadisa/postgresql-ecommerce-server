import {Router as expressRouter} from 'express';
import {getUserProfile, userSignup,
  verifyEmail, sendResetPasswordEmail, resetPassword,
  verifyPasswordResetLink, loginUser, logout,
} from '../controllers';
import {onUserSignup, onUserLogin} from '../middlewares';

const router = expressRouter();

router.post('/user/signup', onUserSignup, userSignup);
router.get('/user/:userId/profile', getUserProfile);
router.post('/signup/user', onUserSignup, userSignup);
router.get('/verify', verifyEmail);
router.post('/login', onUserLogin, loginUser);
router.post('/reset-password/', sendResetPasswordEmail);
router.get('/reset-password', verifyPasswordResetLink);
router.post('/password/reset/:email', resetPassword);
router.get('/logout', logout);

export default router;
