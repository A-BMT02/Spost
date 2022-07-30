const mongoose = require("mongoose");

const googleSchema = new mongoose.Schema({
  displayName: {
    type: String,
  },
  image: {
    type: String,
  },
  googleId: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  connect: [
    {
      social: String,
      id: String,
    },
  ],
});

const googleUser = mongoose.model("googleUser", googleSchema);

module.exports = googleUser;
