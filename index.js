require('dotenv').config();
const express = require("express");
const passport = require('passport');
const facebookStrategy = require('passport-facebook').Strategy;
const session = require('express-session');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8888;
const facebookCallbackRouter = require("./routes/facebookCallbackRouter");
app.use(express.json());
// app.use(express.urlencoded());
app.disable("X-Powered-By");
// app.set("trust proxy", 1);
// app.use(cors({ origin: process.env.ACCEPTED_DOMAIN, credentials: true, methods: "GET, POST, PUT, DELETE" }));
app.use(cors({ origin: '*', credentials: true, methods: "GET, POST, PUT, DELETE" }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-HTTP-Method-Override, Set-Cookie, Cookie");
  next();
});
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Credentials", true);
//   res.header("Access-Control-Allow-Origin", process.env.ACCEPTED_DOMAIN);
//   res.header("Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-HTTP-Method-Override, Set-Cookie, Cookie");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   next();
// });
// app.use(express.static('public'));
// app.set('views', './views');
// app.set('view engine', 'ejs');
// app.use(session(
//   {
//     name: "auth_session",
//     secret: process.env.SECRET_SESSION,
//     resave: true,
//     rolling: false,
//     saveUninitialized: false,
//     unset: "destroy",
//     cookie: {
//       sameSite: "none",
//       secure: true,
//       httpOnly: true,
//       maxAge: 8600000
//     },
//   }
// ));
app.use(session(
  {
    name: "auth_session",
    secret: process.env.SECRET_SESSION,
    cookie: { httpOnly: true },
    resave: true,
    rolling: false,
    saveUninitialized: false,
    unset: "destroy",
  }
));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});
passport.use(new facebookStrategy({
  // pull in our app id and secret from our auth.js file
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: `${process.env.DOMAIN}/auth/facebook/callback`,
  profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)', 'email'],
  passReqToCallback: true
},// facebook will send back the token and profile
  function (req, accessToken, refreshToken, params, profile, done) {
    const expiration = params.expires_in * 1000;
    req.session.cookie.expires = new Date(Date.now() + expiration);
    return done(null, profile);
  }));
app.get("/", (req, res) => {
  res.json({ message: 'sucess' })
});
app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/auth/facebook/profile'
  })
);

app.use("/facebook", facebookCallbackRouter);

app.get('/auth/facebook/profile', isLoggedIn, function (req, res) {
  res.json(req.user);
});

app.get('/auth/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

// route middleware to make sure
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}


/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = 400;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });

  return;
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
