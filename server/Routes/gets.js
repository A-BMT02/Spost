import Express from "express";
import twitter from "../models/twitterConnect.js";

const router = Express.Router();

router.get("/twitter", async (req, res) => {
  const id = req.query["id"];

  const target = await twitter.findOne({ twitterId: id }).lean();
  return res.json({ status: "ok", data: target });
});

export default router;
