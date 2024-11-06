// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: { type: Number, unique: true }, // Sequential user ID
    username: { type: String, required: true, unique: true },
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
