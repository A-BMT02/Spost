import mongoose from "mongoose";

const facebookConnect = new mongoose.Schema({
  facebookId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  accessToken: {
    type: String,
  },
  pageToken: {
    type: String,
  },
});

const facebookInfo = mongoose.model("facebookInfo", facebookConnect);
export default facebookInfo;
