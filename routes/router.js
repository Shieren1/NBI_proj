const express = require('express');
const router = express.Router();
const UserCon = require('../controller/user_con'); 

router.get('/register', UserCon.registerPage);
router.post('/register', UserCon.registerUser);

module.exports = router;