import googleStrategy from "passport-google-oauth20";
import mongoose from "mongoose";
import User from "../models/googleUser.js";
import normalUser from "../models/user.js";

const GoogleStrategy = googleStrategy.Strategy;
export default function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "https://spost.onrender.com/api/user/google/callback",
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
            const updatedUser = await User.findOneAndUpdate(
              { email: profile.emails[0].value },
              {
                googleId: profile.id,
                displayName: profile.displayName,
                image: profile.photos[0].value,
              }
            );
          }
          const userFound = await User.findOne({
            email: profile.emails[0].value,
          });

          if (userFound) {
            done(null, userFound);
          } else {
            const createdUser = (await User.create(newUser)).toJSON();
            done(null, createdUser);
          }
        } catch (err) {
          done(err);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(null, user);
    });
  });
}
