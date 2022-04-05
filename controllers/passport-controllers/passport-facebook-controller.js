const passport = require('passport');
const facebookStrategy = require('passport-facebook').Strategy;
const UserService = require('../../services/use-service')
const initPassportFacebook = () => {
    passport.use(new facebookStrategy({
        // pull in our app id and secret from our auth.js file
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: `${process.env.DOMAIN}/auth/facebook/callback`,
        profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)', 'email'],
        passReqToCallback: true
    },// facebook will send back the token and profile
        async function (req, accessToken, refreshToken, params, profile, done) {
            // find current user in UserModel
            console.log(JSON.stringify(profile));
            // const currentUser = await UserService.getUserBySocialId(profile.id, true, 'facebook');
            // // create new user if the database doesn't have this user
            // if (!currentUser) {
            //     const newUser = await UserService.upsertUser({
            //         last_name: profile._json.name,
            //         first_name: profile._json.screen_name,
            //         email: profile._json.id_str,
            //         facebook_id: profile._json.profile_image_url
            //     });
            //     done(null, newUser);
            // }
            done(null, profile);
        }));
    passport.serializeUser(function (user, done) {
        done(null, user);
    });
    passport.deserializeUser(function (user, done) {
        done(null, user);
    });
};

module.exports = initPassportFacebook