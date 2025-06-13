const express = require('express');
const {
  createReminder,
  getReminders,
  deleteReminder,
  editReminder,
} = require('../controllers/reminderController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

router.post('/',protect, createReminder);
router.get('/', protect , getReminders);
router.delete('/:id',protect, deleteReminder);
router.put('/:id',protect, editReminder);

module.exports = router;
