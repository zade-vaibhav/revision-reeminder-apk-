const express = require('express');
const { register, login, googleRegister, googleLogin, autoLogin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/googleRegister', googleRegister);
router.post('/googleLogin', googleLogin);
router.get('/autoLogin',protect, autoLogin);

module.exports = router;
