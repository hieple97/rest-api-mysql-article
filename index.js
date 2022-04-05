require('dotenv').config();
const cookieSession = require('cookie-session');
const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const keys = require('./config/keys');
const app = express();
const port = process.env.PORT || 8888;
const authRoute = require('./routes/auth-route');
const initPassportFacebook = require('./controllers/passport-controllers/passport-facebook-controller');
const { initData } = require('./config/db');
app.use(
  cookieSession({
    name: 'session',
    keys: [keys.COOKIE_KEY],
    maxAge: 24 * 60 * 60 * 100
  })
);
app.use(express.json());
app.use(express.urlencoded());

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
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true // allow session cookie from browser to pass through
  })
);

// init passport facebook
initPassportFacebook();

app.use('/auth', authRoute);

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({
      authenticated: false,
      message: 'user has not been authenticated'
    });
  } else {
    next();
  }
};

app.get('/', authCheck, (req, res) => {
  res.status(200).json({
    authenticated: true,
    message: 'user successfully authenticated',
    user: req.user,
    cookies: req.cookies
  });
});

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = 400;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
});

app.listen(port, async () => {
  console.log(`Example app listening at http://localhost:${port}`);
  if (process.env.NODE_ENV === 'production') {
    await initData();
  }
});
