const express = require('express');
const router = express.Router();
const {
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
} = require('./user-controller');
const firebaseAuthMiddleware = require('../Middleware/firebaseAuthMiddleware');

console.log('📍 User router loaded - setting up address routes');

// All routes require authentication
router.use(firebaseAuthMiddleware);

// Address management routes
router.get('/addresses', getAddresses);
router.post('/addresses', addAddress);
router.put('/addresses/:addressId', updateAddress);
router.delete('/addresses/:addressId', deleteAddress);
router.put('/addresses/:addressId/default', setDefaultAddress);

console.log('✅ User router configured with', router.stack.length, 'routes');

module.exports = router;
