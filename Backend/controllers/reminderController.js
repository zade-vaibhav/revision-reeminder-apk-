const Reminder = require("../models/Reminder");

exports.createReminder = async (req, res) => {
  const {title,datetime,discription} = req.body
  if(!title || !datetime || !discription){
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
  try {
    const reminder = await Reminder.findByIdAndDelete(req.params.id);

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.status(200).json({ message: "Reminder deleted successfully", reminder });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error while deleting reminder" });
  }
};

