const Strategy = require("passport-twitter").Strategy;
const twitter = require("../models/twitterConnect");
const user = require("../models/googleUser");

module.exports = function (passport) {
  passport.use(
    new Strategy(
      {
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: "http://localhost:5000/api/user/twitter/callback",
        userProfileURL:
          "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true",
      },
      async (token, tokenSecret, profile, cb) => {
        const newTwitter = {
          twitterId: profile.id,
          displayName: profile.displayName,
          image: profile.photos[0].value,
          username: profile.username,
          accessToken: token,
          accessTokenSecret: tokenSecret,
        };

        try {
          const email = profile.emails[0].value;
          const userFound = await user.findOneAndUpdate(
            { email },
            {
              $push: {
                connect: {
                  'social': 'twitter',
                  'id': profile.id,
                },
              },
            }
          ); 

          let twitterFound = await twitter.findOne({ twitterId: profile.id });
          if (twitterFound) {
            cb(null, twitterFound);
          } else {
            twitter.create(newTwitter);
            cb(null, profile);
          }
        } catch (err) {
          console.log(err);
        }
      }
    )
  );

  passport.serializeUser(function (user, cb) {
    cb(null, user);
  });

  passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
  });
};
