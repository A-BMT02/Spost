import Express from "express";
import user from "../models/googleUser.js";
import twitterModel from "../models/twitterConnect.js";
import { TwitterApi } from "twitter-api-v2";
import facebookInfo from "../models/facebookConnect.js";
import axios from "axios";
import fs from "fs";
import FB from "fb";
import { promisify } from "util";
import linkedinInfo from "../models/linkedinConnect.js";

const router = Express.Router();

router.post("/all", async (req, res) => {
  //post content to all social media
  let success = [];
  try {
    const data = req.body;
    const userId = req.body.id;
    const userFound = await user.findOne({ _id: userId }).lean();

    if (userFound) {
      //post to twitter
      if (
        data.twitter.length > 1 ||
        data.twitter[0].text !== "" ||
        data.twitter[0].media.length > 0
      ) {
        const toTwitter = await postToTwitter(userFound, data.twitter);
        if (toTwitter === "done") {
          success.push("twitter");
        }
      }

      //post to facebook
      if (data.facebook.data !== "" || data.facebook.picture.length > 0) {
        const toFacebook = await postToFacebook(
          data.facebook.data,
          data.facebook.id,
          data.facebook.picture
        );

        if (toFacebook === "done") {
          success.push("facebook");
        }
      }

      //post to linkedin
      if (data.linkedin.text !== "") {
        const toLinkedin = await postToLinkedin(
          data.linkedin.id,
          data.linkedin.text
        );
        if (toLinkedin === "done") {
          success.push("linkedin");
        }
      }
    }

    return res.send(success);
  } catch (err) {
    return res.send(err);
  }
});

const postToLinkedin = async (id, text) => {
  const targetLinkedin = await linkedinInfo.findOne({ linkedinId: id });

  const linkedinData = {
    author: `urn:li:person:${targetLinkedin.linkedinId}`,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: {
          text,
        },
        shareMediaCategory: "NONE",
      },
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
    },
  };

  await axios.post(
    `https://api.linkedin.com/v2/ugcPosts?oauth2_access_token=${targetLinkedin.accessToken}`,
    linkedinData,
    {
      headers: {
        "X-Restli-Protocol-Version": "2.0.0",
      },
    }
  );
  return "done";
};

const postToFacebook = async (data, id, picture) => {
  const targetFacebook = await facebookInfo.findOne({ facebookId: id });
  if (targetFacebook) {
    const pageToken = targetFacebook.pageToken;
    if (picture.length !== 0) {
      let postData = {
        message: data,
      };
      await Promise.all(
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

      await FB.api("me/feed", "post", postData);
    } else if (picture.length === 0 && data !== "") {
      await axios.post(
        `https://graph.facebook.com/${targetFacebook.pageId}/feed?message=${data}&access_token=${pageToken}`
      );
    }
    return "done";
  }
};

const postToTwitter = async (userFound, data) => {
  const twitterId = userFound.connect.find((a) => a.social === "twitter").id;
  const tweetObj = await twitterModel.findOne({ twitterId }).lean();

  const client = new TwitterApi({
    appKey: process.env.TWITTER_CONSUMER_KEY,
    appSecret: process.env.TWITTER_CONSUMER_SECRET,
    accessToken: tweetObj.accessToken,
    accessSecret: tweetObj.accessTokenSecret,
  });
  const media = data.filter((obj) => {
    return obj.media.length !== 0;
  });

  if (data.length === 1 && data[0].media.length === 0) {
    oneTweetNoMedia(client, data[0].text);
  } else if (
    data.length === 1 &&
    data[0].text === "" &&
    data[0].media.length === 1
  ) {
    mediaNoTweet(client, data[0].media[0]);
  } else if (
    data.length === 1 &&
    data[0].text === "" &&
    data[0].media.length > 1
  ) {
    multipleImagesNoText(client, data[0].media);
  } else if (data.length === 1 && data[0].media.length === 1) {
    oneTweetAndOneMedia(client, data[0]);
  } else if (data.length === 1 && data[0].media.length > 1) {
    oneTweetAndImages(client, data[0]);
  } else if (data.length > 1) {
    thread(client, data);
  }
  return "done";
};

const thread = async (client, data) => {
  const updatedData = await Promise.all(
    data.map(async (item) => {
      const mediaId = await getMediaId(client, item.media);
      return { status: item.text, media_ids: mediaId };
    })
  );

  const result = await client.v1.tweetThread(updatedData);
  if (result) {
    return "done";
  } else {
    return "error";
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

const oneTweetNoMedia = async (client, text) => {
  const result = await client.v1.tweet(text);
  if (result) {
    return "done";
  } else {
    return "error";
  }
};

const mediaNoTweet = async (client, media) => {
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
    return "done";
  } else {
    return "error";
  }
};

const multipleImagesNoText = async (client, media) => {
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
    return "done";
  } else {
    return "error";
  }
};

const oneTweetAndOneMedia = async (client, data) => {
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
    return "done";
  } else {
    return "error";
  }
};

const oneTweetAndImages = async (client, data) => {
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
    return "done";
  } else {
    return "error";
  }
};

export default router;
