const Reminder = require("../models/Reminder");

//create
exports.createReminder = async (req, res) => {
  const {title,datetime,discription} = req.body
  if(!title || !datetime || !discription){
    return res.status(400).json({message:"all fields are required!!"});
  }
  const reminder = await Reminder.create({ ...req.body, userId: req.user.id });
  res.status(201).json(reminder);
};

//get
exports.getReminders = async (req, res) => {
  const reminders = await Reminder.find({ userId: req.user.id });
  res.json(reminders);
};

//delete
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

//edit
exports.editReminder = async (req, res) => {
  const { title, datetime, discription } = req.body;

  if (!title || !datetime || !discription) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    const updatedReminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, // ensure user only edits their reminder
      { title, datetime, discription },
      { new: true } // return the updated document
    );

    if (!updatedReminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.status(200).json({ message: "Reminder updated successfully", reminder: updatedReminder });
  } catch (error) {
    console.error("Edit error:", error);
    res.status(500).json({ message: "Server error while updating reminder" });
  }
};
