import Express from "express";
import twitter from "../models/twitterConnect.js";
import instagramInfo from "../models/instagramConnect.js";
import facebookInfo from "../models/facebookConnect.js";
import linkedinInfo from "../models/linkedinConnect.js";

const router = Express.Router();

router.post("/socials", async (req, res) => {
  try {
    const data = req.body.data;
    let allConnect = [];

    await Promise.all(
      data.map(async (item) => {
        switch (item.social) {
          case "twitter":
            const twitterRes = await getTwitter(item);
            if (twitterRes.status === "ok") {
              allConnect.push(twitterRes.data);
            }
            return;
          case "instagram":
            const instagramRes = await getInstagram(item);
            if (instagramRes.status === "ok") {
              allConnect.push(instagramRes.data);
            }
            return;
          case "facebook":
            const facebookRes = await getFacebook(item);
            if (facebookRes.status === "ok") {
              allConnect.push(facebookRes.data);
            }
            return;
          case "linkedin":
            const linkedinRes = await getLinkedin(item);
            if (linkedinRes.status === "ok") {
              allConnect.push(linkedinRes.data);
            }
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

const getInstagram = async (item) => {
  try {
    const instagramId = item.id;
    const foundInstagram = await instagramInfo.findOne({ instagramId });
    if (foundInstagram) {
      return {
        status: "ok",
        data: {
          type: "instagram",
          username: foundInstagram.username,
          image: foundInstagram.profilePic,
        },
      };
    }
  } catch (err) {
    return { status: "no" };
  }
};

const getFacebook = async (item) => {
  try {
    const facebookId = item.id;
    const foundFacebook = await facebookInfo.findOne({ facebookId });
    if (foundFacebook) {
      return {
        status: "ok",
        data: {
          type: "facebook",
          username: foundFacebook.displayName,
          image: foundFacebook.image,
          pageId: foundFacebook.pageId,
        },
      };
    }
  } catch (err) {
    return { status: "no" };
  }
};

const getLinkedin = async (item) => {
  try {
    const linkedinId = item.id;

    const foundLinkedin = await linkedinInfo.findOne({ linkedinId });
    if (foundLinkedin) {
      return {
        status: "ok",
        data: {
          type: "linkedin",
          username: foundLinkedin.username,
          image: foundLinkedin.profilePic,
        },
      };
    }
  } catch (err) {
    return { status: "no" };
  }
};

export default router;
