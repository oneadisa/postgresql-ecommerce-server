import {Router as expressRouter} from 'express';
import {
  deleteOrderAction, updateOrderProfile, addCashOrder,
  getMyOrderDetails, getOrderDetails, getAllOrders, addWalletOrder,
  getOrdersProduct, getMyStoreOrderDetails, getMyStoreCustomerDetails,
  getSingleStoreOrderDetails, getOrderDetailsUser, addCashOrderCallback,
  getSingleStoreCustomerDetails, getMyStoreRaised, getStoreRaisedUser,
  getMyStoreRevenue,
} from '../controllers';
import {protect, onOrderCreation} from '../middlewares';


const router = expressRouter();

router.route('/all').get(getAllOrders);

router
    .route('/create')
    .get(addCashOrder);
router
    .route('/create/callback')
    .get(addCashOrderCallback);
router.post('/create/wallet', onOrderCreation, addWalletOrder);

router.get('/me', protect, getMyOrderDetails);
router.get('/me/profile/:userId', protect, getOrderDetailsUser);

router.get('/one/order/:orderId', getOrderDetails);
router.put('/one/update/:orderId', updateOrderProfile);
router.delete('/one/delete/:orderId', protect,
    deleteOrderAction);

router.get('/admin/order/:orderId', getOrderDetails);
router.put('/admin/update/:orderId', updateOrderProfile);
router.delete('/admin/delete/:orderId',
    deleteOrderAction);

router.get('/one/product/:productId', getOrdersProduct);
router.get('/me/order', protect, getMyStoreOrderDetails);
router.get('/me/sales', protect, getMyStoreRaised);
router.get('/me/revenue', protect, getMyStoreRevenue);
router.get('/one/sales/:ownerId', getStoreRaisedUser);
router.get('/me/customer', protect, getMyStoreCustomerDetails);
router.get('/one/order/:ownerId', getSingleStoreOrderDetails);
router.get('/one/customer/:ownerId', getSingleStoreCustomerDetails);
export default router;
