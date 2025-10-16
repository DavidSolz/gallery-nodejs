const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, maxLength:100},
  name: { type: String, maxLength: 100 },
  surname: { type: String, maxLength: 100 },
  password: { type: String }
}, { collection: 'users' });

module.exports = mongoose.model("User", UserSchema);

