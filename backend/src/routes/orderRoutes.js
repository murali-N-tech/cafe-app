const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const {
  createOrder,
  getOrders,
  getOrderById,
  addItemToOrder,
  updateOrderStatus,
  updateItemStatus,
  getOrderHistory,
  cancelOrder,
} = require('../controllers/orderController');

router.use(protect);

router.post('/', authorize('Waiter', 'Cashier', 'Manager', 'Admin'), createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/:id/items', authorize('Waiter', 'Manager'), addItemToOrder);
router.put('/:id/status', authorize('Manager', 'Kitchen Staff', 'Admin'), updateOrderStatus);
router.put('/:orderId/items/:itemId/status', authorize('Kitchen Staff', 'Manager', 'Admin'), updateItemStatus);
router.get('/:id/history', authorize('Manager', 'Admin'), getOrderHistory);
router.put('/:id/cancel', authorize('Waiter', 'Manager', 'Admin'), cancelOrder);

module.exports = router;