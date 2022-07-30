const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  connected: [
    {
      type: String,
    },
  ],
  displayName: {
    type: String,
  },
  image: {
    type: String,
  },
  googleId: {
    type: String,
  },
});

const user = mongoose.model("user", userSchema);

module.exports = user;
