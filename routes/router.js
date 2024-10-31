const express = require('express');
const router = express.Router();
const UserCon = require('../controller/user_con'); 
const AuthCon = require('../controller/authen_con'); 

router.get('/register', UserCon.registerPage);
router.post('/register', UserCon.registerUser);
router.get('/verify/:token', UserCon.verifyEmail);


module.exports = router;
