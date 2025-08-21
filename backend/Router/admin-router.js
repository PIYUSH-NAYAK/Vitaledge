const express = require('express');
const router = express.Router();
const firebaseAuthMiddleware = require('../Middleware/firebaseAuthMiddleware');
const { setCustomClaim, getUserClaims, listUsers } = require('./admin-controller');

// Apply Firebase auth middleware to all admin routes
router.use(firebaseAuthMiddleware);

// Set custom claims for a user (admin only)
router.post('/set-custom-claim', setCustomClaim);

// Get user's custom claims (admin only)
router.get('/user-claims/:email', getUserClaims);

// List all users (admin only)
router.get('/users', listUsers);

module.exports = router;
