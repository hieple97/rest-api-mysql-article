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
app.use(express.urlencoded());
app.use(cors());
app.use(session({ secret: process.env.SECRET_SESSION }));
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
  profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)', 'email']

},// facebook will send back the token and profile
  function (token, refreshToken, profile, done) {
    return done(null, profile);
  }));

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});
app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/auth/facebook/profile',
    failureRedirect: '/login'
  }));

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
