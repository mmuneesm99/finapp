const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  email: String,
  password: String,
  phone: Number,
  role: {
    type: String,
    default: "admin",
  },
});

module.exports = mongoose.model("User", userSchema);
