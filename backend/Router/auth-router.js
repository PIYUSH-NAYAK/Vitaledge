const express = require('express');
const router = express.Router();
const main = require("../Router/auth-controller");

router.route('/').get(main.home);
router.route('/contact').post(main.contactUs);


module.exports = router;