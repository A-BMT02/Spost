import mongoose from "mongoose";

const instagramSchema = new mongoose.Schema({
  instagramId: {
    type: String,
    required: true,
  },
  facebookId: {
    type: String,
  },
  accessToken: {
    type: String,
  },
  username: {
    type: String,
  },
  profilePic: {
    type: String,
  },
});

const instagramInfo = mongoose.model("instagramInfo", instagramSchema);
export default instagramInfo;
