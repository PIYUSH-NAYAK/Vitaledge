const express = require('express');
const router = express.Router();
const home =require('../Router/auth-controller')


router.route('/').get(home);

module.exports = router;