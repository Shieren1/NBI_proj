const express = require('express');
const router = express.Router();
const UserCon = require('../controller/user_con'); 

router.get('/register', UserCon.registerPage);
router.post('/register', UserCon.registerUser);
router.post('/verifyOtp', UserCon.verifyOtp);
router.get('/login', UserCon.loginPage);
router.post('/login', UserCon.loginUser); 

module.exports = router;