const Reminder = require("../models/Reminder");

exports.createReminder = async (req, res) => {
  const reminder = await Reminder.create({ ...req.body, userId: req.user.id });
  res.status(201).json(reminder);
};

exports.getReminders = async (req, res) => {
  const reminders = await Reminder.find({ userId: req.user.id });
  res.json(reminders);
};

exports.deleteReminder = async (req, res) => {
  await Reminder.findByIdAndDelete(req.params.id);
  res.status(204).end();
};
