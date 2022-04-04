require('dotenv').config();
const cookieSession = require("cookie-session");
const express = require("express");
const passport = require('passport');
const session = require('express-session');
const cookieParser = require("cookie-parser");
const cors = require('cors');
const keys = require("./config/keys");
const app = express();
const port = process.env.PORT || 8888;
const authRouter = require("./routes/auth-routes");
const { connection, initData } = require('./config/db');
const initPassportFacebook = require('./services/passportService');
app.use(
  cookieSession({
    name: "session",
    keys: [keys.COOKIE_KEY],
    maxAge: 24 * 60 * 60 * 100
  })
);
// parse cookies
app.use(cookieParser());
// initalize passport
app.use(passport.initialize());
// deserialize cookie from the browser
app.use(passport.session());
// set up cors to allow us to accept requests from our client
app.use(
  cors({
    origin: process.env.CLIENT_HOME_PAGE_URL, // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true // allow session cookie from browser to pass through
  })
);

// init passport facebook
initPassportFacebook();

app.use('/auth', authRouter);

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({
      authenticated: false,
      message: "user has not been authenticated"
    });
  } else {
    next();
  }
};

app.get("/", authCheck, (req, res) => {
  res.status(200).json({
    authenticated: true,
    message: "user successfully authenticated",
    user: req.user,
    cookies: req.cookies
  });
});


/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = 400;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });

  return;
});

app.listen(port, async () => {
  console.log(`Example app listening at http://localhost:${port}`);
  // if (process.env.NODE_ENV === 'production') {
  //   const conn = await connection();// connect to db
  //   await initData(conn);
  // }
});
