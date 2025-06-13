const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getUser } = require('../controllers/UserController');
const router = express.Router();

router.get("/", protect ,getUser)


module.exports = router;