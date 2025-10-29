const express = require('express');
const router = express.Router();
const firebaseAuthMiddleware = require('../Middleware/firebaseAuthMiddleware');
const adminMiddleware = require('../Middleware/adminMiddleware');
const adminOrderController = require('./admin-order-controller');
const { setCustomClaim, getUserClaims, listUsers } = require('./admin-controller');

// Apply Firebase auth middleware to all admin routes
router.use(firebaseAuthMiddleware);
// Apply admin permission check
router.use(adminMiddleware);

// Set custom claims for a user (admin only)
router.post('/set-custom-claim', setCustomClaim);

// Get user's custom claims (admin only)
router.get('/user-claims/:email', getUserClaims);

// List all users (admin only)
router.get('/users', listUsers);

// Admin order management
router.get('/orders', adminOrderController.listOrders);
router.get('/orders/:orderId', adminOrderController.getOrderById);
router.patch('/orders/:orderId/status', adminOrderController.updateOrderStatus);
router.post('/orders/:orderId/transfer', adminOrderController.transferOwnership);

module.exports = router;
