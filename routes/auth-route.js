const express = require("express");
const router = express.Router();
const CLIENT_HOME_PAGE_URL = process.env.CLIENT_HOME_PAGE_URL;
const passport = require('passport');
const { handleLoginSuccess, handleLogout, handleLoginFailed } = require("../controllers/auth-controller");

router.get("/facebook", passport.authenticate('facebook', { scope: 'email' }));

router.get('/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: CLIENT_HOME_PAGE_URL,
        failureRedirect: '/auth/login/failed'
    })
);

router.post("/login/success", handleLoginSuccess);

router.get("/login/failed ", handleLoginFailed);

router.get("/logout", handleLogout);


module.exports = router;
