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



// ✅ Get Authenticated User Data
router.route('/auth').get(authMiddleware, main.authUser);


router.route('/addProduct').post(
    authMiddleware,
    main.addProduct
);
router.route('/getProducts').get(
    authMiddleware,
    main.getProducts
);

module.exports = router;
