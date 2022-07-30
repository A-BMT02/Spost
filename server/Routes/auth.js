const router = require("express").Router();
const user = require("../models/googleUser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerValidation } = require("../utils/validation");
const passport = require("passport");
const protect = require("../Middleware/authMiddleware");
const twitter = require("../models/twitterConnect");

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const { error } = registerValidation(req.body);
  if (error) {
    return res.json({ status: "error", error: error.details[0].message });
  }

  const emailExist = await user.findOne({ email });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  if (emailExist && !emailExist.password) {
    console.log("email ", emailExist);
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
});

router.post("/login", async (req, res) => {
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
});

router.get("/login/failed", (req, res) => {
  res.json({ status: "error", error: "Login with google failed" });
});

router.get("/login/success", async (req, res) => {
  if (req.user && typeof req.user.googleId === "string") {
    return res.json({ status: "ok", data: { user: req.user } });
  } else if (req.get("token")) {
    const token = req.get("token");
    if (token === null || token === "" || token === "null") {
      return res.json({ status: "error", error: "user not found" });
    }
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const userFound = await user.findById(decoded.id).select("-password");
    if (Object.keys(userFound.toObject()).length > 0) {
      return res.json({ status: "ok", data: userFound });
    }
  } else {
    return res.json({ status: "error", error: "user not found" });
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
    failureRedirect: "http://localhost:3000/login",
  }),
  (req, res) => {
    res.redirect("http://localhost:3000/dashboard");
  }
);

router.get("/logout", (req, res) => {
  req.logOut(req.user, (err) => {
    if (err) {
      res.json({ status: "error", error: "Log out unsuccesful" });
    }
  });
  res.json({ status: "ok" });
});

router.get("/twitter", passport.authenticate("twitter"));
// failure http://localhost:3000/login
// res redirect http://localhost:3000/dashboard
router.get(
  "/twitter/callback",
  passport.authenticate("twitter", {
    assignProperty: "federatedUser",
    failureRedirect: "http://localhost:3000/login",
  }),
  function (req, res, next) {
    res.redirect("http://localhost:3000/dashboard");
  }
);

router.get("/twitter/logout", async (req, res) => {
  const id = req.query["id"];

  console.log(id);
  const target = await twitter.findOne({ twitterId: id }).lean();
  console.log("target is ", target);
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
});

module.exports = router;
