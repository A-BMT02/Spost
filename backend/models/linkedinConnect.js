import mongoose from "mongoose";

const linkedinSchema = new mongoose.Schema({
  linkedinId: {
    type: String,
  },
  username: {
    type: String,
  },
  profilePic: {
    type: String,
  },
  accessToken: {
    type: String,
  },
});

const linkedinInfo = mongoose.model("linkedinInfo", linkedinSchema);

export default linkedinInfo;
