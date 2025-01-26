const express = require('express');
const router = express.Router();
const main = require("../Router/auth-controller");

router.route('/').get(main.home);


module.exports = router;