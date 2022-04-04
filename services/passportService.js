const passport = require('passport');
const facebookStrategy = require('passport-facebook').Strategy;
const initPassportFacebook = () => {
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
    passport.serializeUser(function (user, done) {
        done(null, user);
    });
    passport.deserializeUser(function (user, done) {
        done(null, user);
    });
};

module.exports = initPassportFacebook