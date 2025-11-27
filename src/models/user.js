const authConn = require('../config/authDatabase');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

module.exports = authConn.model('User', userSchema, 'users');