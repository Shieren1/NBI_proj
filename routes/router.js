const express = require('express');
const router = express.Router();
const UserCon = require('../controller/user_con'); 
const AuthCon = require('../controller/authen_con'); // Import your new auth controller

router.get('/register', UserCon.registerPage);
router.post('/register', UserCon.registerUser);
router.get('/verify/:token', AuthCon.verifyEmail); // Add this line for email verification

module.exports = router;
