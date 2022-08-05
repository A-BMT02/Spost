const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./Routes/auth");
const passport = require("passport");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const getsRoute = require("./Routes/gets");
const postRoute = require("./Routes/posts");

dotenv.config({ path: ".env" });

require("./config/passport")(passport);
require("./config/passportTwitter")(passport);
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoStore.create({ mongoUrl: process.env.DB_CONNECT }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));

app.use("/api/user", authRoute);
app.use("/api/user/get", getsRoute);
app.use("/api/user/post", postRoute);

mongoose.connect(process.env.DB_CONNECT, () => {
  console.log("Connected to database");
});

app.listen(PORT, () => {
  console.log("Server listening on ", PORT);
});
