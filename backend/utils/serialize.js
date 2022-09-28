 import passport from "passport" ; 
 import User from "../models/googleUser.js" ;
 
 export const Serialize = passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  export const Deserialize = passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    }
    );
  });