const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const user = require("../models/googleUser");
const normalUser = require("../models/user");

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/api/user/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          email: profile.emails[0].value,
          googleId: profile.id,
          displayName: profile.displayName,
          image: profile.photos[0].value,
        };

        try {
          const duplicate = await user.findOne({
            email: profile.emails[0].value,
          });

          if (duplicate && !duplicate.googleId) {
            await user.findOneAndUpdate(
              { email: profile.emails[0].value },
              {
                googleId: profile.id,
                displayName: profile.displayName,
                image: profile.photos[0].value,
              }
            );
          }
          const userFound = await user
            .findOne({ email: profile.emails[0].value })
            .lean();

          if (userFound) {
            done(null, userFound);
          } else {
            user.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.log(err);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    user.findById(id, (err, user) => done(err, user));
  });
};
