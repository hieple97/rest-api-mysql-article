require('dotenv').config();
const express = require("express");
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8888;
const facebookCallbackRouter = require("./routes/facebookCallbackRouter");
const { connection, initData } = require('./config/db');
const initPassportFacebook = require('./services/passportService');
app.use(express.json());
// app.use(express.urlencoded());
app.disable("X-Powered-By");
// app.set("trust proxy", 1);
// app.use(cors({ origin: process.env.ACCEPTED_DOMAIN, credentials: true, methods: "GET, POST, PUT, DELETE" }));
app.use(cors());
// app.use(cors({ origin: '*', credentials: true, methods: "GET, POST, PUT, DELETE" }));
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header("Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-HTTP-Method-Override, Set-Cookie, Cookie");
//   next();
// });
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
    resave: false,
    saveUninitialized: true,
  }
));
app.use(passport.initialize());
app.use(passport.session());
initPassportFacebook();
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

app.listen(port, async () => {
  console.log(`Example app listening at http://localhost:${port}`);
  const conn = await connection();// connect to db
  await initData(conn);
});
