const express = require('express');
const { register, login, googleRegister, googleLogin } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/googleRegister', googleRegister);
router.post('/googleLogin', googleLogin);

module.exports = router;
