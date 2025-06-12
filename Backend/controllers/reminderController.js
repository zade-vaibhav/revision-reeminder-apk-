const Reminder = require("../models/Reminder");

exports.createReminder = async (req, res) => {
  const {title,datetime,discreption} = req.body
  if(!title || !datetime || !discreption){
    return res.status(400).json({message:"all fields are required!!"});
  }
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
