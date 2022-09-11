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
import axios from "axios";
import facebookInfo from "../models/facebookConnect.js";
import { Blob } from "node:buffer";
import { default as FormData } from "form-data";
import intoStream from "into-stream";
import instagramInfo from "../models/instagramConnect.js";

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
    console.log("err is ", err);
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
    failureRedirect: "/signin",
  }),
  (req, res) => {
    res.redirect("/dashboard");
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
  console.log("here twitter");
  try {
    const Client = new TwitterApi({
      appKey: process.env.TWITTER_CONSUMER_KEY,
      appSecret: process.env.TWITTER_CONSUMER_SECRET,
    });

    const authLink = await Client.generateAuthLink(
      "http://spostapp.herokuapp.com/api/user/twitter/callback"
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
    console.log("err is ", err);
    return res.json({
      status: "error",
      error: "An error occured. Try again later",
    });
  }
});

router.get("/twitter/callback", async (req, res) => {
  console.log("here 1");
  try {
    console.log("here 2");
    const { oauth_token, oauth_verifier } = req.query;
    const target = await user.findOne({ "tokens.tempToken": oauth_token });
    const oauth_token_secret = target.tokens.tempTokenSecret;

    if (!oauth_token || !oauth_verifier || !oauth_token_secret) {
      console.log("you denied access");
      return res.redirect("/dashboard");
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

    return res.redirect("/dashboard");
  } catch (err) {
    console.log("twitter err is ", err);
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
    console.log("id is ", instagramId);
    const instagramObj = await axios.get(
      `https://graph.facebook.com/v14.0/${instagramId}?fields=name,username,profile_picture_url&access_token=${pageToken}`
    );
    // console.log("insta obj is ", instagramObj);
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
    // const result2 = await axios.post(
    //   `https://graph.facebook.com/v14.0/${instagramId}/media?image_url=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2Ff%2Ff0%2FBlack_Panther.JPG%2F1200px-Black_Panther.JPG&caption=%23BronzFonz&access_token=EAARghgSyyVwBAOdCTZA3MGO0uaoBzkQEQouBs2Oi4FM2a5Vvb9JUFs8enoRggHs3icVYAlabXZAxtD91SDpvoZBa5FYC6UTQqa2ZBjBjtvm5UNpkriZAqY1LhFInU3F9z0FSYPYfTQndROGrq7hKqmzx8u8HhG0y62ZBtcZB6InLRq4nfG40TWdn0ePnUcUrEQVZCjZA6KngJ4Yr66TA2jxSK`
    // );
    // console.log("res is ", result2);
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
    console.log("insta is ", id);

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
        console.log("c");
        res.send("success");
      }
    }
  } catch (err) {
    console.log("err is ", err);
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
      console.log("here0");

      accessToken = result.data.access_token;
      const idResult = await axios.get(
        `https://graph.facebook.com/me?fields=id,email,name&access_token=${accessToken}`
      );

      if (idResult.status === 200) {
        console.log("here1");
        // console.log("user info is ", idResult.data);
        facebookId = idResult.data.id;
        name = idResult.data.name;
        const getPicture = await axios.get(
          `https://graph.facebook.com/v14.0/${facebookId}/picture?redirect=false&access_token=${accessToken}`
        );
        if (getPicture.status === 200) {
          console.log("here2");
          picture = getPicture.data.data.url;
        }
        console.log("id is ", facebookId, " and token ", accessToken);
        const pageResult = await axios.get(
          `https://graph.facebook.com/v14.0/${facebookId}/accounts?access_token=${accessToken}`
        );
        if (pageResult.status === 200) {
          console.log("here3");
          console.log("pageToken is ", pageResult.data);
          pageToken = pageResult.data.data[0].access_token;

          const pageIdObject = await axios.get(
            `https://graph.facebook.com/${facebookId}/accounts?access_token=${accessToken}`
          );
          console.log("here4");
          pageId = pageIdObject.data.data[0].id;
        }
      }
    } else {
      //error
      console.log("here");
      return res.status(400).json({ error: "An error Occured.Try Again!" });
    }
    console.log(
      "res is ",
      facebookId,
      name,
      picture,
      accessToken,
      pageToken,
      pageId,
      profileId
    );

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
          console.log("success");
          res.json({ status: "ok", data: { name, picture } });
        }
      }
    } else {
      //error
      return res.status(400).json({ error: "An error Occured.Try Again!" });
    }
  } catch (err) {
    console.log("err is ", err);
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
      return res.status(400).json({ error: "An error Occured.Try Again!" });
    }
  } catch (err) {
    return res.status(400).json({ error: "An error Occured.Try Again!" });
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
    return res.status(400).json({ error: "An error Occured.Try Again!" });
  }
});

// router.post("/test", async (req, res) => {
//   // const formdata = req.body.formData;
//   const reader = req.body.result;
//   const blob = req.body.blob;

//   const blobObject = DataURIToBlob(reader);

//   console.log("formdata is ", blobObject, " size is ", blobObject.size);
//   const data = reader.split(",")[1];
//   const imageString = intoStream(data);

//   let formdata = new FormData();
//   formdata.append("image", imageString);
//   // formdata.append("message", "hello");
//   // formdata.append("image", JSON.stringify(blobObject));

//   console.log("fd is ", formdata);
//   const result = await axios.post(
//     `https://graph.facebook.com/v14.0/1232028627552604/uploads?file_length=${blobObject.size}&file_type=image/jpeg&access_token=EAARghgSyyVwBANi7MlNJ33AzeLxMbLe5ZCOxcooGD52B5VZBCv4IGJJBQdekmFCrVlQ9UBI1qBG4FkLYjQAB1hOpt90arq8f98ezMlPZCW6JISofpfN5ZAKs8Q0CK0ZAgJAFLZALr59Jhzj7kmAU7TDZALjYyFhz8kvm52NMeIe3gZDZD`
//   );
//   const id = result.data.id;

//   const config = {
//     headers: {
//       file_offset: "0",
//       Authorization:
//         "OAuth EAARghgSyyVwBAKvsyQ3lhssZBdpptDLNELbOqSTCafs3jl5KujyTTbzkieVcjCm67ZA6LY7oDpyXIZAik9XvnuKlUH66fr4GRj5iQnKICKwbtpXs0Kc98InZAFyP6YEHouQnigWzTOkaN03TyOvZCTS38Kq1aRfTpVedgsBP17AZDZD",
//       "Content-Length": blobObject.size,
//       "Content-type": "multipart/form-data",
//       ...formdata.getHeaders(),
//     },
//   };
//   const result2 = await axios.post(
//     `http://graph.facebook.com/v14.0/${id}`,
//     formdata,
//     config
//   );

// const result = await axios.post(
//   "https://graph.facebook.com/v14.0/101438839361774/photos",
//   formdata
// );
// const idResult = await axios.post(
//   `https://graph.facebook.com/app/uploads?access_token=EAARghgSyyVwBANi7MlNJ33AzeLxMbLe5ZCOxcooGD52B5VZBCv4IGJJBQdekmFCrVlQ9UBI1qBG4FkLYjQAB1hOpt90arq8f98ezMlPZCW6JISofpfN5ZAKs8Q0CK0ZAgJAFLZALr59Jhzj7kmAU7TDZALjYyFhz8kvm52NMeIe3gZDZD`
// );
// console.log("idresult is ", idResult.data);

// const config = {
//   headers: {
//     file_offset: "0",
//     Authorization:
//       "OAuth ghgSyyVwBAKvsyQ3lhssZBdpptDLNELbOqSTCafs3jl5KujyTTbzkieVcjCm67ZA6LY7oDpyXIZAik9XvnuKlUH66fr4GRj5iQnKICKwbtpXs0Kc98InZAFyP6YEHouQnigWzTOkaN03TyOvZCTS38Kq1aRfTpVedgsBP17AZDZD",
//     Host: "graph.facebook.com",
//     Connection: "close",
//     "Content-Type": "multipart/form-data",
//     "Content-Length": blobObject.size,
//     ...formdata.getHeaders(),
//   },
// };
// const result = await axios.post(
//   // &file_length=${blob}&file_type=image/jpeg
//   `https://graph.facebook.com/v14.0/${idResult.data.id}&file_length=${blobObject.size}&file_type=image/jpeg`,
//   formdata,
//   config
// );
//   console.log("res is ", result, " and res2 is", result2);
//   res.send(result.data);
// });

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
