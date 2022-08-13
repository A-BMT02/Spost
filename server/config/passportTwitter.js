// import { TwitterApi } from "twitter-api-v2";
// import router from "../Routes/auth";

// router.get('/twitter' , (req ,res) => {
// const Client = new TwitterApi({ 
//   appKey : process.env.TWITTER_CONSUMER_KEY , 
//   appSecret : process.env.TWITTER_CONSUMER_SECRET
// })

// const authLink = await Client.generateAuthLink('http://localhost:3000/dashboard') ; 

// const URL = authLink.url ; 
// console.log('URL is ' , URL) ; 
// res.send('success') ; 
// })



// import strategy from "passport-twitter";
// import twitter from "../models/twitterConnect.js";
// import user from "../models/googleUser.js";
// import { Serialize , Deserialize } from "../utils/serialize.js";

// const Strategy = strategy.Strategy;

// export default function (passport) {
//   passport.use(
//     new Strategy(
//       {
//         consumerKey: process.env.TWITTER_CONSUMER_KEY,
//         consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
//         callbackURL: "http://localhost:5000/api/user/twitter/callback",
//         userProfileURL:
//           "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true",
//       },
//       async (token, tokenSecret, profile, done) => {
//         const newTwitter = {
//           twitterId: profile.id,
//           displayName: profile.displayName,
//           image: profile.photos[0].value,
//           username: profile.username,
//           accessToken: token,
//           accessTokenSecret: tokenSecret,
//         };

//         try {
//           const email = profile.emails[0].value;
//           const oldUser = await user.find({email}).lean() ; 
//           const userFound = await user.findOneAndUpdate(
//             { email },
//             {
//               $push: {
//                 connect: {
//                   social: "twitter",
//                   id: profile.id,
//                 },
//               },
//             } , {new : true}
//           );
//           done(null, oldUser) ; 
//           // let twitterFound = await twitter.findOne({ twitterId: profile.id });

//         } catch (err) {
//         }
//       }
//     )
//   );

//   Serialize

//   Deserialize
// }
