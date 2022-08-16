import express from "express";
import cors from "cors";
import parser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoute from "./Routes/auth.js";
import passport from "passport";
import session from "express-session";
import mongoCreate from "connect-mongo";
import cookieParser from "cookie-parser";
import getsRoute from "./Routes/gets.js";
import postRoute from "./Routes/posts.js";
import passportConfig from "./config/passport.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname1 = path.resolve();

dotenv.config();

// twitterConfig(passport);
passportConfig(passport);
// if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
//  app.use(express.static(path.resolve(__dirname,'./client/build')));
//  app.get('*', (req, res) => {
//  res.sendFile(path.join(__dirname + '/client/build' , 'index.html'));
//  });
// }
const PORT = process.env.PORT || 5000;
// console.log(PORT)
const app = express();
app.use(
  cors({
    credentials: true,
    origin: [
      "https://spost.netlify.app/",
      "https://spost-two.vercel.app",
      "http://localhost:3000",
      "https://spostapp.herokuapp.com",
    ],
  })
);

app.use(cookieParser());
app.use(parser.urlencoded({ limit: "50mb", extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoCreate.create({ mongoUrl: process.env.DB_CONNECT }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(parser.json({ limit: "50mb" }));

app.use("/api/user", authRoute);
app.use("/api/user/get", getsRoute);
app.use("/api/user/post", postRoute);

app.get("/testing", (req, res) => {
  res.send("hello from the server");
});

mongoose.connect(process.env.DB_CONNECT, () => {
  console.log("Connected to database");
});
if (process.env.NODE_ENV === "production") {
  console.log("here");
  app.use(express.static(path.join(__dirname1, "/client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log("Server listening on ", PORT);
});