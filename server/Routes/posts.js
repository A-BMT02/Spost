const router = require("express").Router();
const twitter = require("twitter");
const twit = require("twit");
const user = require("../models/googleUser");
const twitterModel = require("../models/twitterConnect");
const { TwitThread } = require("twit-thread");

router.post("/twitter", async (req, res) => {
  const data = req.body.data;
  console.log("data is ", data, "and id is ", req.body.id);
  // const tweet = req.body.data;
  const userId = req.body.id;
  // const images = req.body.image.map((item) => item.split("base64,")[1]);
  // const gifImage = req.body.image[0];

  const userFound = await user.findOne({ _id: userId }).lean();
  console.log("userfound is ", userFound);
  if (userFound) {
    const twitterId = userFound.connect.find((a) => a.social === "twitter").id;
    const tweetObj = await twitterModel.findOne({ twitterId }).lean();

    const config = {
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token: tweetObj.accessToken,
      access_token_secret: tweetObj.accessTokenSecret,
    };

    async function tweetThread() {
      const t = new TwitThread(config);
      const texts = data.map((obj) => {
        return { text: obj.text };
      });
      await t.tweetThread(texts);
    }
    tweetThread();
    console.log("done");
    return res.send("ok");

    const twitter = new twit({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token: tweetObj.accessToken,
      access_token_secret: tweetObj.accessTokenSecret,
    });

    // if (images) {
    //   const mediaData = new Buffer.from(images[0], "base64");
    //   const mediaSize = mediaData.length;
    //   const mediaType = "image/gif";
    // const mediaType = "video/mp4";
    // initializeMediaUpload(mediaData, mediaSize, mediaType, twitter);
    //gif
    // const buffer = Buffer.from(video.data, "binary").toString("base64");
    // twitter.post(
    //   "media/upload",
    //   { media_data: img },
    //   function (err, data, response) {
    //     const id = data.media_id_string;
    //     console.log(id);
    //     if (err) {
    //       console.log("gif error is ", err);
    //     }
    //   }
    // );
    //jpg png
    // tweetImages(images, tweet, twitter);
    postThreadNoMedia(twitter, data);

    // twitter.post(
    //   "statuses/update",
    //   {
    //     status:
    //       "Hello twitter , If youre seeing this then the web app that im building is working so far. This is not tweeted from twitter",
    //   },
    //   function (err, data, response) {
    //     console.log(data);
    //   }
    // );
  }

  //  twitter.post(
  //   "statuses/update",
  //   {
  //     status:
  //       "Hello twitter , If youre seeing this then the web app that im building is working so far. This is not tweeted from twitter",
  //   },
  //   function (err, data, response) {
  //     console.log(data);
  //   }
  // );

  function tweetImages(files, status, twitter) {
    let mediaIds = new Array();
    files.forEach(function (file, index) {
      uploadMedia(file, twitter, function (mediaId) {
        mediaIds.push(mediaId);
        if (mediaIds.length === files.length) {
          updateStatus(mediaIds, twitter, status);
        }
      });
    });
  }

  function uploadMedia(file, twitter, callback) {
    twitter.post(
      "media/upload",
      { media: file },
      function (err, data, response) {
        if (!err) {
          let mediaId = data.media_id_string;
          callback(mediaId);
        } else {
          console.log(`Error 1 is ${err}`);
        }
      }
    );
  }

  function updateStatus(mediaIds, twitter, status) {
    let meta_params = { media_id: mediaIds[0] };
    twitter.post(
      "media/metadata/create",
      meta_params,
      function (err, data, response) {
        if (!err) {
          let params = { status: status, media_ids: mediaIds };
          twitter.post(
            "statuses/update",
            params,
            function (err, data, response) {
              if (err) {
                console.log(`Error 2 is ${err}`);
              }
            }
          );
        } else {
          console.log(`Error 3 is ${err}`);
        }
      }
    );
  }

  //functions to post gifs/videos as used in the twitJS documentation
  function initializeMediaUpload(mediaData, mediaSize, mediaType, twitter) {
    return new Promise(function (resolve, reject) {
      twitter.post(
        "media/upload",
        {
          command: "INIT",
          total_bytes: mediaSize,
          media_type: mediaType,
        },
        function (error, data, response) {
          if (error) {
            console.log("err 0 is ", error);
            reject(error);
          } else {
            resolve(appendFileChunk(data.media_id_string, mediaData, twitter));
          }
        }
      );
    });
  }

  function appendFileChunk(mediaId, mediaData, twitter) {
    return new Promise(function (resolve, reject) {
      twitter.post(
        "media/upload",
        {
          command: "APPEND",
          media_id: mediaId,
          media: mediaData,
          segment_index: 0,
        },
        function (error, data, response) {
          if (error) {
            console.log("err 1 is ", error);
            reject(error);
          } else {
            resolve(finalizeUpload(mediaId, twitter));
          }
        }
      );
    });
  }

  function finalizeUpload(mediaId, twitter) {
    return new Promise(function (resolve, reject) {
      twitter.post(
        "media/upload",
        {
          command: "FINALIZE",
          media_id: mediaId,
        },
        function (error, data, response) {
          if (error) {
            console.log("err 2 is ", error);
            reject(error);
          } else {
            resolve(publishStatusUpdate(mediaId, twitter));
          }
        }
      );
    });
  }

  function publishStatusUpdate(mediaId, twitter) {
    return new Promise(function (resolve, reject) {
      twitter.post(
        "statuses/update",
        {
          status: tweet,
          media_ids: mediaId,
        },
        function (error, data, response) {
          if (error) {
            console.log("error 3 is ", error);
            reject(error);
          } else {
            console.log("Successfully uploaded media and tweeted!");
            resolve(data);
          }
        }
      );
    });
  }
  res.send("hello from the server");
});

module.exports = router;
