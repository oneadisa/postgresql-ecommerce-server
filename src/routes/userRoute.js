import {Router as expressRouter} from 'express';
import {
  getSingleUser, getAllUsers,
} from '../controllers';
import {isAuthenticatedUser} from '../middlewares';


const router = expressRouter();

router
    .route('/all')
    .get(isAuthenticatedUser, getAllUsers);

router
    .route('/user/:id')
    .get(isAuthenticatedUser, getSingleUser);

export default router;
