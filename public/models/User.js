const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  id: String,
  username: String,
  discriminator: String,
  token: String,
  access_token: String,
  refresh_token: String,
  avatar: String,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
