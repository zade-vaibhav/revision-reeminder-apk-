const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  datetime: { type: Date, required: true },
  repeat: { type: String }, // e.g. "daily", "weekly"
  completed: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Reminder', reminderSchema);
