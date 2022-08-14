import googleStrategy from "passport-google-oauth20";
import mongoose from "mongoose";
import User from "../models/googleUser.js";
import normalUser from "../models/user.js";
// import { Serialize , Deserialize } from "../utils/serialize.js";

const GoogleStrategy = googleStrategy.Strategy;

export default function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "https://spost1.herokuapp.com/api/user/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          email: profile.emails[0].value,
          googleId: profile.id,
          displayName: profile.displayName,
          image: profile.photos[0].value,
        };

        try {
          const duplicate = await User.findOne({
            email: profile.emails[0].value,
          });

          if (duplicate && !duplicate.googleId) {
            console.log('duplicate is ' , duplicate.lean()) ; 
            const updatedUser = await User.findOneAndUpdate(
              { email: profile.emails[0].value },
              {
                googleId: profile.id,
                displayName: profile.displayName,
                image: profile.photos[0].value,
              }
            );
            console.log('updated user is ' , updatedUser) ; 
          }
          const userFound = await User
            .findOne({ email: profile.emails[0].value })
            .lean();

          if (userFound) {
            // console.log('userFound is ' , userFound) ;
            done(null, userFound);
          } else {
            const createdUser = (await User.create(newUser)).toJSON()
            // console.log('created user is ', createdUser) ;
            done(null, createdUser);
          }
        } catch (err) {
          console.log('err is ' , err) ; 
          done(err) ; 
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    // console.log('user is ' , user)  ;
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    // console.log('id is ' , id) ; 
    User.findById(id, (err, user) => {
      // console.log('User 2 is ' , user ) ; 
      done(null, user)
    }
    );
  });
}
