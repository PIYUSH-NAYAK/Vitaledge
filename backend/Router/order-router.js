const express = require('express');
const router = express.Router();
const orderController = require('./order-controller');
const firebaseAuthMiddleware = require('../Middleware/firebaseAuthMiddleware');

// Public verification endpoint MUST come before authentication middleware
// This is a PUBLIC route - no login required
router.get('/orders/verify/:orderId', orderController.verifyOrder);

// All other order routes require authentication
router.use(firebaseAuthMiddleware);

// Order routes (protected)
router.post('/orders', orderController.createOrder);
router.get('/orders', orderController.getUserOrders);
router.post('/orders/payment', orderController.processBlockchainPayment);

// Specific routes MUST come before dynamic :orderId route
router.get('/orders/:orderId/track', orderController.trackOrder);
router.put('/orders/:orderId/cancel', orderController.cancelOrder);

// Dynamic route should be LAST
router.get('/orders/:orderId', orderController.getOrderDetails);

module.exports = router;
