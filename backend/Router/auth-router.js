const express = require('express');
const router = express.Router();
const main = require("../Router/auth-controller");
const valid = require("../Middleware/Validator");
const signupValid = require("../Validator/signupValid");
const loginValid = require("../Validator/loginUp");
const authMiddleware = require('../Middleware/authMiddleware');

router.route('/').get(main.home);
router.route('/contact').post(main.contactUs);

// ✅ Register with Validation
router.route('/register').post(
    valid(signupValid),  // Ensure middleware returns correct validation
    main.register
);

// ✅ Login with Validation
router.route('/login').post(
    valid(loginValid),   // Ensure middleware returns correct validation
    main.login
);

// ✅ Create Batch (Solana Batch Creation)
router.route('/createBatch').post(main.createBatch);

// ✅ Receive Signed Transaction from Phantom and Submit to Solana
router.route('/sendTransaction').post(main.sendTransaction);

// ✅ Get Authenticated User Data
router.route('/auth').get(authMiddleware, main.authUser);

module.exports = router;
