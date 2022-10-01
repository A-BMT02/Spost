import Express from "express";
import user from "../models/googleUser.js";
import twitterModel from "../models/twitterConnect.js";
import { TwitterApi } from "twitter-api-v2";
import { fileTypeFromFile } from "file-type";
import facebookInfo from "../models/facebookConnect.js";
import axios from "axios";
import instagramInfo from "../models/instagramConnect.js";
import fs from "fs";
import { default as FormData } from "form-data";
import fetch from "node-fetch";
import { Blob } from "buffer";
import FB from "fb";
import { promisify } from "util";

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

router.post("/facebook", async (req, res) => {
  try {
    const data = req.body.data;
    const id = req.body.id;
    const picture = req.body.picture;

    const targetFacebook = await facebookInfo.findOne({ facebookId: id });
    if (targetFacebook) {
      const pageToken = targetFacebook.pageToken;
      if (picture.length !== 0) {
        let postData = {
          message: data,
        };
        let postIds = await Promise.all(
          picture.map(async (pic, index) => {
            const base64Data = pic.file.split(",")[1];
            const writeFileAsync = promisify(fs.writeFile);
            const unlinkAsync = promisify(fs.unlink);
            await writeFileAsync(
              `./images/image${id}${index}.${pic.extension}`,
              base64Data,
              "base64"
            );

            FB.options({
              accessToken: targetFacebook.pageToken,
            });
            const a = await FB.api("me/photos?published=false", "post", {
              source: fs.createReadStream(
                `./images/image${id}${index}.${pic.extension}`
              ),
            });
            await unlinkAsync(`./images/image${id}${index}.${pic.extension}`);
            return (postData[
              `attached_media[${index}]`
            ] = `{media_fbid: ${a.id}}`);
          })
        );

        const b = await FB.api("me/feed", "post", postData);

        return res.send("success");
      } else if (picture.length === 0 && data !== "") {
        const postResult = await axios.post(
          `https://graph.facebook.com/${targetFacebook.pageId}/feed?message=${data}&access_token=${pageToken}`
        );
        return res.send("success");
      }
    }
  } catch (err) {
    return res.status(400).json({
      status: "error",
      error: "An error occured while posting to facebook!",
    });
  }
});

router.post("/instagram", async (req, res) => {
  try {
    const picture = req.body.picture;
    const text = req.body.text;
    const id = req.body.id;

    const targetInstagram = await instagramInfo.findOne({ instagramId: id });
    if (targetInstagram) {
      const token = targetInstagram.accessToken;
      const initialPost = await axios.post(
        `https://graph.facebook.com/v14.0/${id}/media?image_url=${picture}&caption=${text}&access_token=${token}`
      );
      if (initialPost.data.id) {
        await axios.post(
          `https://graph.facebook.com/v14.0/${id}/media_publish?creation_id=${initialPost.data.id}&access_token=${token}`
        );
        return res.send("success");
      }
    }
  } catch (err) {
    return res.status(400).json({
      status: "error",
      error: "An unknown error occured while posting to instagram",
    });
  }
});
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
