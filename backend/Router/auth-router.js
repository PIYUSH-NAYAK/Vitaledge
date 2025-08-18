const express = require('express');
const router = express.Router();
const main = require("../Router/auth-controller");
const firebaseAuthMiddleware = require('../Middleware/firebaseAuthMiddleware');

router.route('/').get(main.home);
router.route('/contact').post(main.contactUs);

// Registration and login routes removed; handled by Firebase Auth in frontend

// ✅ Get Authenticated User Data (now using Firebase)
router.route('/auth').get(firebaseAuthMiddleware, main.authUser);

router.route('/addProduct').post(
    firebaseAuthMiddleware,
    main.addProduct
);
router.route('/getProducts').get(
    firebaseAuthMiddleware,
    main.getProducts
);

module.exports = router;
