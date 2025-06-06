const passport = require("passport");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const createError = require("http-errors");
const { GOOGLE } = require("../config");

const UserModel = require("../models/user");
const UserModelInstance = new UserModel();

const AuthService = require("../services/AuthService");
const AuthServiceInstance = new AuthService();

module.exports = (app) => {
  //intialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  //set method to serialize data to store in cookie
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  //set method to deserialize data storedin cookie and attach to req.user
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserModelInstance.findOneById(id);
      if (user) {
        done(null, user); /// attaches user object to req.user
      } else {
        done(null, false); // when user is not found
      }
    } catch (error) {
      done(error);
    }
  });

  //configure local strategy to be used for local login
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await AuthServiceInstance.login({
          email: username,
          password,
        });
        return done(null, user);
      } catch (error) {
        done(error);
      }
    })
  );

  // Configure strategy to be use for Google login
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE.CLIENT_ID,
        clientSecret: GOOGLE.CLIENT_SECRET,
        callbackURL: GOOGLE.CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await AuthServiceInstance.googleLogin(profile);
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  return passport;
};
