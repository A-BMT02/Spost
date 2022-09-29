import Express from "express";
import user from "../models/googleUser.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { registerValidation } from "../utils/validation.js";
import passport from "passport";
import twitter from "../models/twitterConnect.js";
import { TwitterApi } from "twitter-api-v2";
import tokens from "../models/tempTokens.js";
import axios from "axios";
import facebookInfo from "../models/facebookConnect.js";
import { Blob } from "node:buffer";
import { default as FormData } from "form-data";
import intoStream from "into-stream";
import instagramInfo from "../models/instagramConnect.js";
import linkedinInfo from "../models/linkedinConnect.js";

const router = Express.Router();
router.post("/register", async (req, res) => {
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
  try {
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
  } catch (err) {
    return res.json({
      status: "error",
      error: "An error occured. Try again later",
    });
  }
});

router.get("/login/success", async (req, res) => {
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
    failureRedirect: "https://spost.onrender.com/signin",
  }),
  (req, res) => {
    res.redirect("https://spostapp.vercel.app//dashboard");
  }
);

router.get("/logout", async (req, res) => {
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

    const updatedUser = await user.findByIdAndUpdate(req.get("id"), newUser);

    res.json({ URL });
  } catch (err) {
    return res.json({
      status: "error",
      error: "An error occured. Try again later",
    });
  }
});

router.get("/twitter/callback", async (req, res) => {
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

router.get("/linkedin", async (req, res) => {
  try {
    const code = req.query["code"];
    const id = req.query["id"];

    const token = await axios.post(
      `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${code}&redirect_uri=http://https://spostapp.vercel.app/dashboard&client_id=${process.env.LINKEDIN_APP_ID}&client_secret=${process.env.LINKEDIN_APP_SECRET}`
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

    await linkedinInfo.create({
      accessToken,
      linkedinId,
      username: name,
      profilePic: picture,
    });
    const updatedUser = await user.findOneAndUpdate(
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

router.get("/instagram", async (req, res) => {
  const id = req.query["id"];

  const foundUser = await user.findById(id);
  const facebookId = foundUser.connect.find((item) => {
    return item.social === "facebook";
  });
  if (!facebookId) {
    return res.json({
      status: "error",
      error: "You have to connect your facebook account first",
    });
  }

  const facebookObject = await facebookInfo.findOne({
    facebookId: facebookId.id,
  });
  if (!facebookObject) {
    return res.json({
      status: "error",
      error: "You have to connect your facebook account first",
    });
  }
  const pageId = facebookObject.pageId;
  const accessToken = facebookObject.accessToken;
  const pageToken = facebookObject.pageToken;

  const result = await axios.get(
    `https://graph.facebook.com/v14.0/${pageId}?fields=instagram_business_account&access_token=${accessToken}`
  );
  if (result.status == 200) {
    const instagramId = result.data.instagram_business_account.id;
    const instagramObj = await axios.get(
      `https://graph.facebook.com/v14.0/${instagramId}?fields=name,username,profile_picture_url&access_token=${pageToken}`
    );
    const instaUsername = instagramObj.data.username;
    const instaProfile = instagramObj.data.profile_picture_url;

    const saveInstagram = await instagramInfo.create({
      instagramId,
      facebookId: facebookId.id,
      accessToken,
      username: instaUsername,
      profilePic: instaProfile,
    });
    if (saveInstagram) {
      const updatedUser = await user.findOneAndUpdate(
        { _id: id },
        {
          $push: { connect: { social: "instagram", id: instagramId } },
        }
      );
      return res.send("success");
    }
  }

  return res.json({
    status: "error",
    error: "An error Occured",
  });
});

router.get("/twitter/logout", async (req, res) => {
  try {
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
  } catch (err) {
    return res.json({
      status: "error",
      error: "An error occured. Try again later",
    });
  }
});

router.get("/facebook/logout", async (req, res) => {
  try {
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

router.get("/instagram/logout", async (req, res) => {
  try {
    const id = req.query["id"];

    const deleteInstagram = await instagramInfo.findOneAndDelete({
      instagtamId: id,
    });
    if (deleteInstagram) {
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

router.get("/facebook", async (req, res) => {
  const tempToken = req.query["accessToken"];
  const userId = req.query["user"];

  let facebookId = "";
  let name = "";
  let picture = "";
  let accessToken = "";
  let pageToken = "";
  let pageId = "";
  let profileId = "";
  try {
    const result = await axios.get(
      `https://graph.facebook.com/v14.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&fb_exchange_token=${tempToken}`
    );
    if (result.status === 200) {
      accessToken = result.data.access_token;
      const idResult = await axios.get(
        `https://graph.facebook.com/me?fields=id,email,name&access_token=${accessToken}`
      );

      if (idResult.status === 200) {
        facebookId = idResult.data.id;
        name = idResult.data.name;
        const getPicture = await axios.get(
          `https://graph.facebook.com/v14.0/${facebookId}/picture?redirect=false&access_token=${accessToken}`
        );
        if (getPicture.status === 200) {
          picture = getPicture.data.data.url;
        }
        const pageResult = await axios.get(
          `https://graph.facebook.com/v14.0/${facebookId}/accounts?access_token=${accessToken}`
        );
        if (pageResult.status === 200) {
          pageToken = pageResult.data.data[0].access_token;

          const pageIdObject = await axios.get(
            `https://graph.facebook.com/${facebookId}/accounts?access_token=${accessToken}`
          );
          ("here4");
          pageId = pageIdObject.data.data[0].id;
        }
      }
    } else {
      return res.status(400).json({ error: "An error Occured.Try Again!" });
    }

    if (
      facebookId !== "" &&
      name !== "" &&
      picture !== "" &&
      accessToken !== "" &&
      pageToken !== "" &&
      pageId !== ""
    ) {
      const newFacebook = await facebookInfo.create({
        facebookId,
        displayName: name,
        image: picture,
        accessToken,
        pageToken,
        pageId,
      });
      if (newFacebook) {
        const updatedUser = await user.findOneAndUpdate(
          { _id: userId },
          {
            $push: { connect: { social: "facebook", id: facebookId } },
          }
        );
        if (updatedUser) {
          res.json({ status: "ok", data: { name, picture } });
        }
      }
    } else {
      return res.status(400).json({ error: "An error Occured.Try Again!" });
    }
  } catch (err) {
    return res.status(400).json({ error: "An error Occured.Try Again!" });
  }
});

router.get("/facebook/details", async (req, res) => {
  try {
    const facebookId = req.query["id"];
    const foundFacebook = await facebookInfo.findOne({ facebookId });
    if (foundFacebook) {
      return res.status(200).json({
        displayName: foundFacebook.displayName,
        image: foundFacebook.image,
        pageId: foundFacebook.pageId,
      });
    } else {
      return res.status(201).json({ error: "An error Occured.Try Again!" });
    }
  } catch (err) {
    return res.status(201).json({ error: "An error Occured.Try Again!" });
  }
});

router.get("/linkedin/details", async (req, res) => {
  try {
    const linkedinId = req.query["id"];
    console.log("id is ", linkedinId);

    const foundLinkedin = await linkedinInfo.findOne({ linkedinId });
    if (foundLinkedin) {
      return res.status(200).json({
        displayName: foundLinkedin.username,
        image: foundLinkedin.profilePic,
      });
    } else {
      console.log("not found");
      return res.status(201).json({ error: "An error Occured.Try Again!" });
    }
  } catch (err) {
    console.log("err is ", err);
    return res.status(201).json({ error: "An error Occured.Try Again!" });
  }
});

router.get("/instagram/details", async (req, res) => {
  try {
    const instagramId = req.query["id"];
    const foundInstagram = await instagramInfo.findOne({ instagramId });
    if (foundInstagram) {
      return res.status(200).json({
        displayName: foundInstagram.username,
        image: foundInstagram.profilePic,
      });
    }
  } catch (err) {
    return res.status(201).json({ error: "An error Occured.Try Again!" });
  }
});

router.get("/test", (req, res) => {
  return res.status(200).send("success");
});

function DataURIToBlob(dataURI) {
  const splitDataURI = dataURI.split(",");
  const byteString =
    splitDataURI[0].indexOf("base64") >= 0
      ? atob(splitDataURI[1])
      : decodeURI(splitDataURI[1]);
  const mimeString = splitDataURI[0].split(":")[1].split(";")[0];

  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);

  return new Blob([ia], { type: mimeString });
}

export default router;
