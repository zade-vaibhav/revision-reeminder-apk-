const User = require("../models/User");

exports.getUser = async (req,res) => {
const reminders = await User.findOne({ _id: req.user.id });
  res.status(200).json(reminders);
}