import Express from "express";
import user from "../models/googleUser.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { registerValidation } from "../utils/validation.js";
import passport from "passport";
import twitter from "../models/twitterConnect.js";
import { TwitterApi } from "twitter-api-v2";
import axios from "axios";
import facebookInfo from "../models/facebookConnect.js";
import linkedinInfo from "../models/linkedinConnect.js";

const router = Express.Router();
router.post("/register", async (req, res) => {
  //check if user exists , if not create a new user record
  try {
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
  } catch (err) {
    return res.json({
      status: "error",
      error: "An error occured. Try again later",
    });
  }
});

router.post("/login", async (req, res) => {
  //check if user credentials exists for loggin in
  try {
    const { email, password } = req.body;

    const User = await user.findOne({ email }).lean();
    if (!User) {
      return res.json({ status: "error", error: "Invalid email/password" });
    }

    if (await bcrypt.compare(password, User.password)) {
      const token = jwt.sign({ id: User._id }, process.env.TOKEN_SECRET);
      const userEmail = User.email;
      req.user = User;
      return res.json({ status: "ok", token, email: userEmail });
    }

    return res.json({ status: "error", error: "Invalid email/password" });
  } catch (err) {
    return res.json({
      status: "error",
      error: "An error occured. Try again later",
    });
  }
});

router.get("/login/success", async (req, res) => {
  //check if user is logged in or not
  try {
    if (req.user && typeof req.user.googleId === "string") {
      return res.json({ status: "ok", data: req.user });
    }
    try {
      const token = req.get("token");

      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

      const userFound = await user.findById(decoded.id).select("-password");
      if (userFound) {
        return res.json({ status: "ok", data: userFound });
      } else {
        return res.json({ status: "error", error: "user not found" });
      }
    } catch (err) {
      return res.json({ status: "error", error: "An error occured" });
    }
  } catch (err) {
    return res.json({
      status: "error",
      error: "An error occured. Try again later",
    });
  }
});

router.get(
  //initialize google auth using passportJs
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
    failureRedirect: "https://spostapp.vercel.app/signin",
  }),
  (req, res) => {
    res.redirect("https://spostapp.vercel.app/dashboard");
  }
);

router.get("/logout", async (req, res) => {
  //logout user and remove cookie
  try {
    req.logout((err) => {
      if (!err) {
        req.session = null;
        res.clearCookie("connect.sid", { path: "/" });
        return res.json({ status: "ok" });
      }
    });
  } catch (err) {
    return res.json({
      status: "error",
      error: "An error occured. Try again later",
    });
  }
});

router.get("/twitter", async (req, res) => {
  //grab users temporary token which will be used to genereate permanent tokens in /twitter/callback
  try {
    const Client = new TwitterApi({
      appKey: process.env.TWITTER_CONSUMER_KEY,
      appSecret: process.env.TWITTER_CONSUMER_SECRET,
    });

    const authLink = await Client.generateAuthLink(
      "https://web-production-191a.up.railway.app/api/user/twitter/callback"
    );
    const URL = authLink.url;
    const oauthToken = authLink.oauth_token;
    const oauthTokenSecret = authLink.oauth_token_secret;

    const foundUser = await user.findById(req.get("id")).lean();
    const newUser = {
      ...foundUser,
      tokens: {
        tempToken: oauthToken,
        tempTokenSecret: oauthTokenSecret,
      },
    };

    await user.findByIdAndUpdate(req.get("id"), newUser);

    res.json({ URL });
  } catch (err) {
    return res.json({
      status: "error",
      error: "An error occured. Try again later",
    });
  }
});

router.get("/twitter/callback", async (req, res) => {
  //use twitter temp token to generate permanent token
  try {
    const { oauth_token, oauth_verifier } = req.query;
    const target = await user.findOne({ "tokens.tempToken": oauth_token });
    const oauth_token_secret = target.tokens.tempTokenSecret;

    if (!oauth_token || !oauth_verifier || !oauth_token_secret) {
      return res.redirect("https://spostapp.vercel.app/dashboard");
    }

    let client = new TwitterApi({
      appKey: process.env.TWITTER_CONSUMER_KEY,
      appSecret: process.env.TWITTER_CONSUMER_SECRET,
      accessToken: oauth_token,
      accessSecret: oauth_token_secret,
    });
    //use permanent token to create a twiiter object and also link the user model to the twitter model

    const loggedObj = await client.login(oauth_verifier);
    client = new TwitterApi({
      appKey: process.env.TWITTER_CONSUMER_KEY,
      appSecret: process.env.TWITTER_CONSUMER_SECRET,
      accessToken: loggedObj.accessToken,
      accessSecret: loggedObj.accessSecret,
    });
    const twitterObj = await client.currentUser();
    await twitter.create({
      twitterId: twitterObj.id,
      displayName: twitterObj.name,
      image: twitterObj.profile_image_url,
      username: twitterObj.screen_name,
      accessToken: loggedObj.accessToken,
      accessTokenSecret: loggedObj.accessSecret,
    });

    await user.findOneAndUpdate(
      { "tokens.tempToken": oauth_token },
      {
        $push: { connect: { social: "twitter", id: twitterObj.id } },
      }
    );

    return res.redirect("https://spostapp.vercel.app/dashboard");
  } catch (err) {}
});

router.get("/twitter/logout", async (req, res) => {
  try {
    //delete user twitter data from database
    const id = req.query["id"];

    await twitter.findOne({ twitterId: id }).lean();
    await twitter.findOneAndDelete({ twitterId: id });

    await user.findOneAndUpdate(
      { "connect.id": id },
      {
        $pull: {
          connect: { id: id },
        },
      }
    );

    res.json({ status: "ok" });
  } catch (err) {
    return res.json({
      status: "error",
      error: "An error occured. Try again later",
    });
  }
});

router.get("/linkedin", async (req, res) => {
  try {
    //authorize using linkedin and get neccessary user data
    const code = req.query["code"];
    const id = req.query["id"];

    const token = await axios.post(
      `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${code}&redirect_uri=https://spostapp.vercel.app/dashboard&client_id=${process.env.LINKEDIN_APP_ID}&client_secret=${process.env.LINKEDIN_APP_SECRET}`
    );
    const accessToken = token.data.access_token;

    const profile = await axios.get(
      `https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,emailAddress,profilePicture(displayImage~:playableStreams))&oauth2_access_token=${accessToken}`
    );

    const linkedinId = profile.data.id;
    const picture =
      profile.data.profilePicture["displayImage~"].elements[0].identifiers[0]
        .identifier;
    const name = `${profile.data.firstName.localized.en_US}${profile.data.lastName.localized.en_US}`;

    //store the linkedin data in the Linkedin Model and connect the user model to the linkedin Model
    await linkedinInfo.create({
      accessToken,
      linkedinId,
      username: name,
      profilePic: picture,
    });
    await user.findOneAndUpdate(
      { _id: id },
      {
        $push: { connect: { social: "linkedin", id: linkedinId } },
      }
    );
    return res.send("success");
  } catch (err) {
    return res.status(400).json({
      status: "error",
      error: "An error Occured",
    });
  }
});

router.get("/linkedin/logout", async (req, res) => {
  try {
    //delete user linkedin data from database

    const id = req.query["id"];

    await linkedinInfo.findOne({ linkedinId: id }).lean();
    await linkedinInfo.findOneAndDelete({ twitterId: id });

    await user.findOneAndUpdate(
      { "connect.id": id },
      {
        $pull: {
          connect: { id: id },
        },
      }
    );

    res.json({ status: "ok" });
  } catch (err) {
    return res.json({
      status: "error",
      error: "An error occured. Try again later",
    });
  }
});

router.get("/facebook", async (req, res) => {
  const tempToken = req.query["accessToken"];
  const userId = req.query["user"];

  let facebookId = "";
  let name = "";
  let picture = "";
  let accessToken = "";
  let pageToken = "";
  let pageId = "";

  //get all the neccessary facebook data needed and store in database
  try {
    //exchange facebook temp token for permanent access token
    const result = await axios.get(
      `https://graph.facebook.com/v14.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&fb_exchange_token=${tempToken}`
    );
    accessToken = result.data.access_token;
    //use access token to get user-id, email and name
    const idResult = await axios.get(
      `https://graph.facebook.com/me?fields=id,email,name&access_token=${accessToken}`
    );

    facebookId = idResult.data.id;
    name = idResult.data.name;
    //get user profile picture
    const getPicture = await axios.get(
      `https://graph.facebook.com/v14.0/${facebookId}/picture?redirect=false&access_token=${accessToken}`
    );
    picture = getPicture.data.data.url;
    //get faceook page-id and page-token
    const pageResult = await axios.get(
      `https://graph.facebook.com/v14.0/${facebookId}/accounts?access_token=${accessToken}`
    );
    pageToken = pageResult.data.data[0].access_token;
    pageId = pageIdObject.data.data[0].id;

    if (
      facebookId !== "" &&
      name !== "" &&
      picture !== "" &&
      accessToken !== "" &&
      pageToken !== "" &&
      pageId !== ""
    ) {
      //create a facebook object for user and link user model to facebook model
      const newFacebook = await facebookInfo.create({
        facebookId,
        displayName: name,
        image: picture,
        accessToken,
        pageToken,
        pageId,
      });
      const updatedUser = await user.findOneAndUpdate(
        { _id: userId },
        {
          $push: { connect: { social: "facebook", id: facebookId } },
        }
      );
      return res.json({ status: "ok", data: { name, picture } });
    } else {
      return res.status(400).json({ error: "An error Occured.Try Again!" });
    }
  } catch (err) {
    return res.status(400).json({ error: "An error Occured.Try Again!" });
  }
});

router.get("/facebook/logout", async (req, res) => {
  try {
    //delete user facebook data from database
    const id = req.query["id"];

    const deleteTwitter = await facebookInfo.findOneAndDelete({
      facebookId: id,
    });
    if (deleteTwitter) {
      const userTarget = await user.findOneAndUpdate(
        { "connect.id": id },
        {
          $pull: {
            connect: { id: id },
          },
        }
      );
      if (userTarget) {
        res.send("success");
      }
    }
  } catch (err) {
    res.status(400);
  }
});

export default router;
