import Express from "express";
// const twitter = require("twitter");
// const twit = require("twit");
import user from "../models/googleUser.js";
import twitterModel from "../models/twitterConnect.js";
// const { TwitThread } = require("twit-thread");
import { TwitterApi } from "twitter-api-v2";
import { fileTypeFromFile } from "file-type";
import facebookInfo from "../models/facebookConnect.js";
import axios from "axios";
import instagramInfo from "../models/instagramConnect.js";
// import panther from "../images/panther.jpg";
import fs from "fs";
import { default as FormData } from "form-data";
import fetch from "node-fetch";
import { Blob } from "buffer";

const router = Express.Router();
router.post("/twitter", async (req, res) => {
  try {
    const data = req.body.data;

    const userId = req.body.id;
    const userFound = await user.findOne({ _id: userId }).lean();

    if (userFound) {
      const twitterId = userFound.connect.find(
        (a) => a.social === "twitter"
      ).id;
      const tweetObj = await twitterModel.findOne({ twitterId }).lean();

      const client = new TwitterApi({
        appKey: process.env.TWITTER_CONSUMER_KEY,
        appSecret: process.env.TWITTER_CONSUMER_SECRET,
        accessToken: tweetObj.accessToken,
        accessSecret: tweetObj.accessTokenSecret,
      });

      const rwClient = client.readWrite;
      const v1Client = client.v1;

      const media = data.filter((obj) => {
        return obj.media.length !== 0;
      });

      if (data.length === 1 && data[0].media.length === 0) {
        oneTweetNoMedia(client, data[0].text, res);
      } else if (
        data.length === 1 &&
        data[0].text === "" &&
        data[0].media.length === 1
      ) {
        mediaNoTweet(client, data[0].media[0], res);
      } else if (
        data.length === 1 &&
        data[0].text === "" &&
        data[0].media.length > 1
      ) {
        multipleImagesNoText(client, data[0].media, res);
      } else if (data.length === 1 && data[0].media.length === 1) {
        oneTweetAndOneMedia(client, data[0], res);
      } else if (data.length === 1 && data[0].media.length > 1) {
        oneTweetAndImages(client, data[0], res);
      } else if (data.length > 1) {
        thread(client, data, res);
      }
    }
  } catch (err) {
    return res.status(400).json({
      status: "error",
      error: "An unknown error occured while posting to twitter!",
    });
  }
});

// router.post("/test", async (req, res) => {
//   const stats = fs.statSync("./images/game.mp4");
//   const fileSizeInBytes = stats.size;

//   const headers = {
//     "Content-Type": "multipart/form-data",
//     file_offset: "0",
//     Authorization:
//       "OAuth EAARghgSyyVwBAB3uHVa10JOyZBS07MbjJ9E6ZBGXMEC3y4cP8bSvuyZB1r0Xwxr8eaVdwHFhGXfH7boFIGRsE83cKHDzBBU5iTE2qo62ZByc27e1vkpvpEQOGSlrrMxVcldoFiimy0BOfc6wcZA2ijyVyc25HfZAGdiVYAq3DgdAZDZD",
//     "Content-Length": fileSizeInBytes,
//   };
//   let formdata = new FormData();
//   const fileData = fs.createReadStream("./images/game.mp4");
//   const blob = new Blob([fileData]);

//   formdata.append("source", JSON.stringify(blob));
//   formdata.append(
//     "access_token",
//     "EAARghgSyyVwBAB3uHVa10JOyZBS07MbjJ9E6ZBGXMEC3y4cP8bSvuyZB1r0Xwxr8eaVdwHFhGXfH7boFIGRsE83cKHDzBBU5iTE2qo62ZByc27e1vkpvpEQOGSlrrMxVcldoFiimy0BOfc6wcZA2ijyVyc25HfZAGdiVYAq3DgdAZDZD"
//   );

//   try {
//     const a = await axios.post(
//       "https://graph-video.facebook.com/v14.0/101438839361774/videos?access_token=EAARghgSyyVwBAGZAYx6XZBbMKQg3LnAYRRsRrlU2qiE7k1mlxXb4r7GWa47XtZATPZCKJVhxEiy6H0h9QZAZCIUz4vmjtdBcNntMRCkb6vFQeJoXmtVWT2q51ZB3X0lNylH3snJkL6ou9TIIfkzx9kC3YNmw1grVQRbVJwI06AH9JQcGNaTrk1w",
//       formdata,
//       { headers: headers }
//     );
//     console.log("a is ", a);
//   } catch (err) {
//     console.log("err is ", err, " data is ", err.response);
//     return res.send("success");
//   }

//   res.send("success");
// });

router.post("/facebook", async (req, res) => {
  //posting local file
  // const stats = fs.statSync("./images/panther.jpg");
  // const stats2 = fs.statSync("./images/black.png");
  // const fileSizeInBytes = stats2.size;
  // const a = await axios.post(
  //   `https://graph.facebook.com/v14.0/${process.env.FACEBOOK_APP_ID}/uploads?file_length=${fileSizeInBytes}&file_type=image/png&access_token=EAARghgSyyVwBAB3uHVa10JOyZBS07MbjJ9E6ZBGXMEC3y4cP8bSvuyZB1r0Xwxr8eaVdwHFhGXfH7boFIGRsE83cKHDzBBU5iTE2qo62ZByc27e1vkpvpEQOGSlrrMxVcldoFiimy0BOfc6wcZA2ijyVyc25HfZAGdiVYAq3DgdAZDZD`
  // );
  // console.log("id is ", a.data.id);

  // const formdata = new FormData();
  // formdata.append("source", fs.createReadStream("./images/black.png"));

  // const headers = {
  //   "Content-Type": "multipart/form-data",
  //   file_offset: "0",
  //   Authorization:
  //     "OAuth EAARghgSyyVwBAB3uHVa10JOyZBS07MbjJ9E6ZBGXMEC3y4cP8bSvuyZB1r0Xwxr8eaVdwHFhGXfH7boFIGRsE83cKHDzBBU5iTE2qo62ZByc27e1vkpvpEQOGSlrrMxVcldoFiimy0BOfc6wcZA2ijyVyc25HfZAGdiVYAq3DgdAZDZD",
  //   "Content-Length": fileSizeInBytes,
  // };

  // const b = await axios.post(
  //   `https://graph.facebook.com/v14.0/${a.data.id}&access_token=EAARghgSyyVwBAB3uHVa10JOyZBS07MbjJ9E6ZBGXMEC3y4cP8bSvuyZB1r0Xwxr8eaVdwHFhGXfH7boFIGRsE83cKHDzBBU5iTE2qo62ZByc27e1vkpvpEQOGSlrrMxVcldoFiimy0BOfc6wcZA2ijyVyc25HfZAGdiVYAq3DgdAZDZD`,
  //   formdata,
  //   { headers: headers }
  // );

  // console.log("b is ", b);
  // console.log("size is ", fileSizeInBytes);

  // res.send("success");

  //working version

  try {
    const data = req.body.data;
    const id = req.body.id;
    const picture = req.body.picture;

    const targetFacebook = await facebookInfo.findOne({ facebookId: id });
    if (targetFacebook) {
      const pageToken = targetFacebook.pageToken;
      console.log("page id is ", pageToken);
      if (data !== "" && picture !== "") {
        const postResult0 = await axios.post(
          `https://graph.facebook.com/${targetFacebook.pageId}/photos?url=${picture}&message=${data}&access_token=${pageToken}`
        );
        console.log("post result 0 is ", postResult0);
        return res.send("success");
      } else if (picture === "" && data !== "") {
        const postResult = await axios.post(
          `https://graph.facebook.com/${targetFacebook.pageId}/feed?message=${data}&access_token=${pageToken}`
        );
        console.log("post result 1 is ", postResult);
        return res.send("success");
      } else {
        const postResult2 = await axios.post(
          `https://graph.facebook.com/${targetFacebook.pageId}/photos?url=${picture}&access_token=${pageToken}`
        );
        console.log("post result 2 is ", postResult2);
        return res.send("success");
      }
    }
  } catch (err) {
    console.log("err is ", err, " data", err.response);
    return res.status(400).json({
      status: "error",
      error: "Unsupported media type for facebook post!",
    });
  }
});

router.post("/instagram", async (req, res) => {
  try {
    const picture = req.body.picture;
    const text = req.body.text;
    const id = req.body.id;
    console.log("pic ", picture, " text ", text, " id ", id);

    const targetInstagram = await instagramInfo.findOne({ instagramId: id });
    if (targetInstagram) {
      const token = targetInstagram.accessToken;
      const initialPost = await axios.post(
        `https://graph.facebook.com/v14.0/${id}/media?image_url=${picture}&caption=${text}&access_token=${token}`
      );
      if (initialPost.data.id) {
        const post = await axios.post(
          `https://graph.facebook.com/v14.0/${id}/media_publish?creation_id=${initialPost.data.id}&access_token=${token}`
        );
        console.log("post is ", post);
        return res.send("success");
      }
    }
  } catch (err) {
    console.log("err is ", err, " data", err.response);
    return res.status(400).json({
      status: "error",
      error: "An unknown error occured while posting to instagram",
    });
  }
});
//mime types reference => https://github.com/PLhery/node-twitter-api-v2/blob/master/src/types/v1/tweet.v1.types.ts
const thread = async (client, data, res) => {
  const updatedData = await Promise.all(
    data.map(async (item) => {
      const mediaId = await getMediaId(client, item.media);
      return { status: item.text, media_ids: mediaId };
    })
  );

  const result = await client.v1.tweetThread(updatedData);
  if (result) {
    return res.json({ status: "ok" });
  } else {
    return res.json({
      status: "error",
      error: "An error occured. Please try again",
    });
  }
};

const getMediaId = async (client, mediaArray) => {
  let type = "";
  let imagesBuffer = [];
  if (mediaArray.length > 1) {
    type = "image/jpeg";
    imagesBuffer = mediaArray.map((image) => {
      return Buffer.from(
        image.file.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
    });
  } else {
    if (mediaArray[0]?.type === "gif") {
      type = "image/gif";
      imagesBuffer = mediaArray.map((image) => {
        return Buffer.from(
          image.file.replace(/^data:image\/\w+;base64,/, ""),
          "base64"
        );
      });
    } else if (mediaArray[0]?.type === "video") {
      type = "video/mp4";
      imagesBuffer = mediaArray.map((image) => {
        return Buffer.from(
          image.file.replace(/^data:video\/\w+;base64,/, ""),
          "base64"
        );
      });
    }
  }

  const mediaId = await Promise.all(
    imagesBuffer.map(async (buffer) => {
      const media = await client.v1.uploadMedia(buffer, {
        mimeType: type,
      });
      return media;
    })
  );

  return mediaId;
};

const oneTweetNoMedia = async (client, text, res) => {
  const result = await client.v1.tweet(text);
  if (result) {
    return res.json({ status: "ok" });
  } else {
    return res.json({
      status: "error",
      error: "An error occured. Please try again",
    });
  }
};

const mediaNoTweet = async (client, media, res) => {
  let image = "";
  let type = "";
  if (media?.type === "image") {
    image = media.file.replace(/^data:image\/\w+;base64,/, "");
    type = "image/jpeg";
  } else if (media?.type === "gif") {
    image = media.file.replace(/^data:image\/\w+;base64,/, "");
    type = "image/gif";
  } else if (media?.type === "video") {
    image = media.file.replace(/^data:video\/\w+;base64,/, "");
    type = "video/mp4";
  }
  const buffer = Buffer.from(image, "base64");
  const mediaId = await client.v1.uploadMedia(buffer, {
    mimeType: type,
  });
  if (mediaId) {
    await client.v2.tweet("", { media: { media_ids: [mediaId] } });
    return res.json({ status: "ok" });
  } else {
    return res.json({
      status: "error",
      error: "An error occured. Please try again",
    });
  }
};

const multipleImagesNoText = async (client, media, res) => {
  const imagesBuffer = media.map((image) => {
    return Buffer.from(
      image.file.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
  });

  const type = "image/jpeg";
  const mediaId = await Promise.all(
    imagesBuffer.map(async (buffer) => {
      const media = await client.v1.uploadMedia(buffer, {
        mimeType: type,
      });
      return media;
    })
  );

  const result = await client.v2.tweet("", {
    media: { media_ids: [...mediaId] },
  });
  if (result) {
    return res.json({ status: "ok" });
  } else {
    return res.json({
      status: "error",
      error: "An error occured. Please try again",
    });
  }
};

const oneTweetAndOneMedia = async (client, data, res) => {
  let image = "";
  let type = "";
  if (data.media[0]?.type === "image") {
    image = data.media[0].file.replace(/^data:image\/\w+;base64,/, "");
    type = "image/jpeg";
  } else if (data.media[0]?.type === "gif") {
    image = data.media[0].file.replace(/^data:image\/\w+;base64,/, "");
    type = "image/gif";
  } else if (data.media[0]?.type === "video") {
    image = data.media[0].file.replace(/^data:video\/\w+;base64,/, "");
    type = "video/mp4";
  }
  const buffer = Buffer.from(image, "base64");
  const mediaId = await client.v1.uploadMedia(buffer, {
    mimeType: type,
  });
  if (mediaId) {
    await client.v2.tweet(data.text, { media: { media_ids: [mediaId] } });
    return res.json({ status: "ok" });
  } else {
    return res.json({
      status: "error",
      error: "An error occured. Please try again",
    });
  }
};

const oneTweetAndImages = async (client, data, res) => {
  const imagesBuffer = data.media.map((image) => {
    return Buffer.from(
      image.file.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
  });

  const type = "image/jpeg";
  const mediaId = await Promise.all(
    imagesBuffer.map(async (buffer) => {
      const media = await client.v1.uploadMedia(buffer, {
        mimeType: type,
      });
      return media;
    })
  );

  const result = await client.v2.tweet(data.text, {
    media: { media_ids: [...mediaId] },
  });
  if (result) {
    return res.json({ status: "ok" });
  } else {
    return res.json({
      status: "error",
      error: "An error occured. Please try again",
    });
  }
};

export default router;
