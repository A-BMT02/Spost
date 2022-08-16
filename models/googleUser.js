import mongoose from "mongoose";

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
  tokens :{
    tempToken : {
    type : String
    } , 
    tempTokenSecret : {
    type : String
    }
  }
});

const googleUser = mongoose.model("googleUser", googleSchema);
export default googleUser;
