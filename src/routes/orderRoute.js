import {Router as expressRouter} from 'express';
import {
  deleteOrderAction, updateOrderProfile, addOrder,
  getMyOrderDetails, getOrderDetails, getAllOrders,
  getOrdersProduct, getMyStoreOrderDetails,
  getSingleStoreOrderDetails,
} from '../controllers';
import {protect, onOrderCreation} from '../middlewares';


const router = expressRouter();

router.route('/all').get(getAllOrders);

router
    .route('/create')
    .post(onOrderCreation, addOrder);

// router.put('/me/update', protect, updateMyOrderProfile);
router.get('/me', protect, getMyOrderDetails);
// router.delete('/me/delete', protect, deleteMyOrderAccount);

router.get('/one/order/:orderId', getOrderDetails);
router.put('/one/update/:orderId', updateOrderProfile);
router.delete('/one/delete/:orderId', protect,
    deleteOrderAction);

router.get('/admin/order/:orderId', getOrderDetails);
router.put('/admin/update/:orderId', updateOrderProfile);
router.delete('/admin/delete/:orderId',
    deleteOrderAction);

router.get('/one/product/:productId', getOrdersProduct);
router.get('/me/store', getMyStoreOrderDetails);
router.get('/one/order/:ownerId', getSingleStoreOrderDetails);
export default router;
