const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email_verified:{
     type:Boolean,
     default:false
    },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local',
      },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
