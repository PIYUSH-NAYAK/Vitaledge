const express = require('express');
const router = express.Router();
const orderController = require('./order-controller');
const firebaseAuthMiddleware = require('../Middleware/firebaseAuthMiddleware');

// All order routes require authentication
router.use(firebaseAuthMiddleware);

// Order routes
router.post('/orders', orderController.createOrder);
router.get('/orders', orderController.getUserOrders);
router.get('/orders/:orderId', orderController.getOrderDetails);
router.post('/orders/payment', orderController.processBlockchainPayment);
router.get('/orders/:orderId/track', orderController.trackOrder);
router.put('/orders/:orderId/cancel', orderController.cancelOrder);

module.exports = router;
