const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const UserService = require('../../services/user-service');
const initPassportFacebook = () => {
  passport.use(new FacebookStrategy({
    // pull in our app id and secret from our auth.js file
    clientID: process.env.CLIENT_ID_FACEBOOK,
    clientSecret: process.env.CLIENT_SECRET_FACEBOOK,
    callbackURL: `${process.env.DOMAIN}/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)', 'email'],
    passReqToCallback: true
  }, // facebook will send back the token and profile
  async function (req, accessToken, refreshToken, params, profile, done) {
    // find current user in UserModel
    let profilePicture = null;
    const userInfo = profile._json;
    const { id: facebookId, last_name: lastName, first_name: firstName, email } = userInfo;
    if (userInfo.picture && userInfo.picture.data) {
      profilePicture = userInfo.picture.data.url;
    }
    // console.log({ facebookId, lastName, firstName, email, profilePicture });
    // create new user if the database doesn't have this user
    await UserService.upsertUser({
      lastName,
      firstName,
      email,
      facebookId
    });
    done(null, { lastName, firstName, email, profilePicture });
  }));
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  // deserialize the cookieUserId to user in the database
  passport.deserializeUser(async (user, done) => {
    try {
      const userInfo = await UserService.findUserByEmail(user.email, true);
      if (userInfo) {
        const { last_name: lastName, first_name: firstName, email, profile_picture: profilePicture } = userInfo;
        return done(null, { lastName, firstName, email, profilePicture });
      }
    } catch (error) {
      console.log(error);
      return done(error, null);
    }
  });
};

module.exports = initPassportFacebook;
