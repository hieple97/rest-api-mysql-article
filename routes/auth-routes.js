const express = require("express");
const router = express.Router();
const CLIENT_HOME_PAGE_URL = process.env.CLIENT_HOME_PAGE_URL;
const passport = require('passport');

router.get("/facebook", passport.authenticate('facebook', { scope: 'email' }));

router.post("/login/success", async function (req, res, next) {
    if (req.user) {
        res.json({
            success: true,
            message: "user has successfully authenticated",
            user: req.user,
            cookies: req.cookies
        });
    }
});

router.get('/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: CLIENT_HOME_PAGE_URL,
        failureRedirect: '/auth/login/failed'
    })
);

router.get("/login/failed ", async function (req, res, next) {
    req.logout();
    res.redirect(CLIENT_HOME_PAGE_URL);
});

router.get("/logout", async function (req, res, next) {
    try {
        req.logout();
        res.redirect(CLIENT_HOME_PAGE_URL);
    } catch (err) {
        console.error(err.message);
        next(err);
    }
});


module.exports = router;
