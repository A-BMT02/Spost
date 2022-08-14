import googleStrategy from "passport-google-oauth20";
import mongoose from "mongoose";
import User from "../models/googleUser.js";
import normalUser from "../models/user.js";
import { Serialize , Deserialize } from "../utils/serialize.js";

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
            await User.findOneAndUpdate(
              { email: profile.emails[0].value },
              {
                googleId: profile.id,
                displayName: profile.displayName,
                image: profile.photos[0].value,
              }
            );
          }
          const userFound = await User
            .findOne({ email: profile.emails[0].value })
            .lean();

          if (userFound) {
            done(null, userFound);
          } else {
            const createdUser = (await User.create(newUser)).toJSON()
            done(null, createdUser);
          }
        } catch (err) {
        }
      }
    )
  );
  Serialize

  Deserialize
}
