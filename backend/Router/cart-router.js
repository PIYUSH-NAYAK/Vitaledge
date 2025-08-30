const express = require('express');
const router = express.Router();
const cartController = require('./cart-controller');
const firebaseAuthMiddleware = require('../Middleware/firebaseAuthMiddleware');

// All cart routes require authentication
router.use(firebaseAuthMiddleware);

// Cart routes
router.get('/cart', cartController.getCart);
router.post('/cart/add', cartController.addToCart);
router.put('/cart/update', cartController.updateCartItem);
router.delete('/cart/remove/:medicineId', cartController.removeFromCart);
router.delete('/cart/clear', cartController.clearCart);

module.exports = router;
