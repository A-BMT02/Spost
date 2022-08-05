const router = require("express").Router();
const twitter = require("../models/twitterConnect");

router.get("/twitter", async (req, res) => {
  const id = req.query["id"];
  console.log("id is ", id);

  const target = await twitter.findOne({ twitterId: id }).lean();
  console.log(target);
  return res.json({ status: "ok", data: target });
});

module.exports = router;
