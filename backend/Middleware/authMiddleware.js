const jwt = require("jsonwebtoken");
const user = require("../models/googleUser");

module.exports = async (req, res, next) => {
  let token;
  //make sure the jwt token sent from the client is valid
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      req.user = await user.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.json({ status: "error", error: "Not authorized" });
    }
  }
  if (!token) {
    res.json({ status: "error", error: "Not authorized" });
  }
};
