const mongoose = require("mongoose");

const twitterConnect = new mongoose.Schema({
  twitterId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
  accessTokenSecret: {
    type: String,
    required: true,
  },
});

const twitterInfo = mongoose.model("twitterInfo", twitterConnect);

module.exports = twitterInfo;
