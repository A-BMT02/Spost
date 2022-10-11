import Express from "express";
import twitter from "../models/twitterConnect.js";
import facebookInfo from "../models/facebookConnect.js";
import linkedinInfo from "../models/linkedinConnect.js";

const router = Express.Router();

router.post("/socials", async (req, res) => {
  try {
    //get all socials connected to a user account
    const data = req.body.data;
    let allConnect = [];

    await Promise.all(
      data.map(async (item) => {
        switch (item.social) {
          case "twitter":
            const twitterRes = await getTwitter(item);
            allConnect.push(twitterRes.data);
            return;
          case "instagram":
            const instagramRes = await getInstagram(item);
            allConnect.push(instagramRes.data);
            return;
          case "facebook":
            const facebookRes = await getFacebook(item);
            allConnect.push(facebookRes.data);
            return;
          case "linkedin":
            const linkedinRes = await getLinkedin(item);
            allConnect.push(linkedinRes.data);
            return;
        }
      })
    );

    return res.status(200).json(allConnect);
  } catch (err) {
    return res.status(400);
  }
});

const getTwitter = async (item) => {
  //find twitter account connected to user account
  try {
    const id = item.id;

    const target = await twitter.findOne({ twitterId: id }).lean();
    return {
      status: "ok",
      data: {
        type: "twitter",
        username: target.username,
        displayName: target.displayName,
        image: target.image,
      },
    };
  } catch (err) {
    return { status: "no" };
  }
};

const getFacebook = async (item) => {
  try {
    //find facebook account connected to user account
    const facebookId = item.id;
    const foundFacebook = await facebookInfo.findOne({ facebookId });
    return {
      status: "ok",
      data: {
        type: "facebook",
        username: foundFacebook.displayName,
        image: foundFacebook.image,
        pageId: foundFacebook.pageId,
      },
    };
  } catch (err) {
    return { status: "no" };
  }
};

const getLinkedin = async (item) => {
  try {
    //find linkedin account connected to user account
    const linkedinId = item.id;

    const foundLinkedin = await linkedinInfo.findOne({ linkedinId });
    return {
      status: "ok",
      data: {
        type: "linkedin",
        username: foundLinkedin.username,
        image: foundLinkedin.profilePic,
      },
    };
  } catch (err) {
    return { status: "no" };
  }
};

export default router;
