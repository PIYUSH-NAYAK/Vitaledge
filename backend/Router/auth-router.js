const express = require('express');
const router = express.Router();
const main = require("../Router/auth-controller");
const valid =  require("../Middleware/Validator");
const signupValid = require("../Validator/signupValid");
const loginValid = require("../Validator/loginUp");
const authMiddleware = require('../Middleware/authMiddleware');
router.route('/').get(main.home);
router.route('/contact').post(main.contactUs);
router.route('/register').post(
    valid(signupValid),  // Ensure this function returns a middleware, not just a boolean
    main.register
);
router.route('/login').post(
    valid(loginValid),   // Same as above
    main.login
);

router.route('/auth').get(authMiddleware ,main.authUser);
module.exports = router;
