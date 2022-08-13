import Express from "express";
import user from "../models/googleUser.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { registerValidation } from "../utils/validation.js";
import passport from "passport";
// import protect from "../Middleware/authMiddleware.js";
import twitter from "../models/twitterConnect.js";
import { TwitterApi } from "twitter-api-v2";
import tokens from "../models/tempTokens.js";


const router = Express.Router();
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const { error } = registerValidation(req.body);
  if (error) {
    return res.json({ status: "error", error: error.details[0].message });
  }

  const emailExist = await user.findOne({ email });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  if (emailExist && !emailExist.password) {
    await user.findOneAndUpdate({ email }, { password: hashedPassword });
    return res.json({ status: "ok", data: email });
  } else if (emailExist && emailExist.password) {
    return res.json({ status: "error", error: "Email alerady registered" });
  }

  try {
    const newUser = new user({
      email,
      password: hashedPassword,
    });
    newUser.save();

    return res.json({ status: "ok", data: newUser.email });
  } catch (error) {
    if (error.code === 11000) {
      return res.json({ status: "error", error: "Email alerady registered" });
    }
    throw error;
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const User = await user.findOne({ email }).lean();
  if (!User) {
    const token = jwt;
    return res.json({ status: "error", error: "Invalid email/password" });
  }

  if (await bcrypt.compare(password, User.password)) {
    const token = jwt.sign({ id: User._id }, process.env.TOKEN_SECRET);
    const userEmail = User.email;
    req.user = User;
    return res.json({ status: "ok", token, email: userEmail });
  }

  return res.json({ status: "error", error: "Invalid email/password" });
});

router.get("/login/failed", (req, res) => {
  res.json({ status: "error", error: "Login with google failed" });
});

router.get("/login/success", async (req, res) => {
  if (req.user && typeof req.user.googleId === "string") {
    return res.json({ status: "ok", data: req.user });
  } else if (req.get("token")) {
    const token = req.get("token");
    if (token === null || token === "" || token === "null") {
      return res.json({ status: "error", error: "user not found" });
    }
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const userFound = await user.findById(decoded.id).select("-password");
    if (userFound) {
      return res.json({ status: "ok", data: userFound });
    }
    else {
    return res.json({ status: "error", error: "user not found" });
  }
  } 
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
  }),
  (req, res) => {
    res.redirect("http://localhost:3000/dashboard");
  }
);

router.get("/logout", async (req, res) => {  
   req.logout((err) => {
    if(!err) {
      req.session = null ; 
   res.clearCookie('connect.sid' , {path : '/'}) ; 
   return res.json({status : 'ok'}) ; 
    }
   }) ; 
   



});

// router.get("/twitter", passport.authenticate("twitter"));
// // failure http://localhost:3000/login
// // res redirect http://localhost:3000/dashboard
// router.get(
//   "/twitter/callback",
//   passport.authenticate("twitter", {
//     assignProperty: "federatedUser",
//     failureRedirect: "http://localhost:3000/login",
//   }),
//   function (req, res, next) {
//     res.redirect("http://localhost:3000/dashboard");
//   }
// );

router.get('/twitter' , async (req ,res) => {
const Client = new TwitterApi({ 
  appKey : process.env.TWITTER_CONSUMER_KEY , 
  appSecret : process.env.TWITTER_CONSUMER_SECRET
})
// ''
const authLink = await Client.generateAuthLink('http://localhost:5000/api/user/twitter/callback') ; 

const URL = authLink.url ; 
const oauthToken = authLink.oauth_token ; 
const oauthTokenSecret = authLink.oauth_token_secret ; 

const foundUser = await user.findById(req.get('id')).lean() ;
const newUser = { ...foundUser , tokens : {
  tempToken : oauthToken , 
  tempTokenSecret : oauthTokenSecret
}
}

const updatedUser = await user.findByIdAndUpdate(req.get("id") , newUser) ;

res.json({URL}) ; 
 })

router.get('/twitter/callback' ,async  (req , res) => {
  const { oauth_token , oauth_verifier } = req.query ; 
  const target = await user.findOne({'tokens.tempToken' : oauth_token})
  const oauth_token_secret = target.tokens.tempTokenSecret ; 

  if(!oauth_token || !oauth_verifier  || !oauth_token_secret ) {
    console.log('you denied access') ;
    return ; 
  }

let client = new TwitterApi({
   appKey : process.env.TWITTER_CONSUMER_KEY , 
  appSecret : process.env.TWITTER_CONSUMER_SECRET ,
    accessToken: oauth_token,
    accessSecret: oauth_token_secret,
  })
 
  const loggedObj = await client.login(oauth_verifier) ;
   ;
    client = new TwitterApi({
   appKey : process.env.TWITTER_CONSUMER_KEY , 
  appSecret : process.env.TWITTER_CONSUMER_SECRET ,
    accessToken: loggedObj.accessToken,
    accessSecret: loggedObj.accessSecret,
  })
  const twitterObj = await client.currentUser() ; 
    await twitter.create({
      twitterId : twitterObj.id , 
      displayName : twitterObj.name , 
      image : twitterObj.profile_image_url , 
      username : twitterObj.screen_name , 
      accessToken : loggedObj.accessToken , 
      accessTokenSecret : loggedObj.accessSecret
    })

   await user.findOneAndUpdate({'tokens.tempToken' : oauth_token} , {
    $push : {connect : {social : 'twitter' , id : twitterObj.id}}
  })


  return res.redirect('http://localhost:3000/dashboard')




})


router.get("/twitter/logout", async (req, res) => {
  const id = req.query["id"];

  const target = await twitter.findOne({ twitterId: id }).lean();
  const deleteTwitter = await twitter.findOneAndDelete({ twitterId: id });

  const userTarget = await user.findOneAndUpdate(
    { "connect.id": id },
    {
      $pull: {
        connect: { id: id },
      },
    }
  );

  res.json({ status: "ok" });
});

export default router;
