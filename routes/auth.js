const express = require("express");
const router = express.Router();
const AuthService = require("../services/AuthService");
const AuthorizationUtils = require("../utils/middlewares/AuthorizationUtils");
const { matchedData, checkSchema, checkExact } = require("express-validator");
const {
  registerSchema,
  loginSchema,
} = require("../utils/schemaValidators/auth");
const {
  ValidateSchemaResult,
} = require("../utils/middlewares/ValidateSchemaResults");

const AuthServiceInstance = new AuthService();
const AuthorizationUtilsInstance = new AuthorizationUtils();

module.exports = (app, passport) => {
  app.use("/auth", router);

  //registration Endpoint
  router.post(
    "/register",
    registerSchema,
    ValidateSchemaResult,
    async (req, res, next) => {
      try {
        let data = matchedData(req);

        // setting default role for customers
        data = { ...data, role_id: 3 };

        // register user with auth service
        const response = await AuthServiceInstance.register(data);

        // res with success message
        res.status(201).send({ message: "new user registered" });
      } catch (error) {
        next(error);
      }
    }
  );

  //Login Endpoint
  router.post(
    "/login",
    loginSchema,
    ValidateSchemaResult,
    passport.authenticate("local"),
    async (req, res, next) => {
      try {
        const { username, password } = matchedData(req);

        const response = await AuthServiceInstance.login({
          email: username,
          password,
        });

        res.status(200).send(response);
      } catch (error) {
        next(error);
      }
    }
  );

  //isLoggedIn Endpoint
  router.post(
    "/logged_in",
    AuthorizationUtilsInstance.isAuthenticated,
    (req, res) => {
      res.send({ isAuthenticated: true });
    }
  );

  //Logout Endpoint
  router.get(
    "/logout",
    AuthorizationUtilsInstance.isAuthenticated,
    (req, res, next) => {
      //clears for passport
      req.logout((err) => {
        if (err) {
          return next(err);
        }

        // detroys sessions
        req.session.destroy((err) => {
          if (err) {
            return next(err);
          }

          res.clearCookie("connect.sid"); // clear the session cookie
          res.status(200).send({
            isAuthenticated: false,
            message: "User logged out and session destroyed",
          });
        });
      });
    }
  );

  // Google Login Endpoint
  router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile"] })
  );

  // Google Login Callback Endpoint
  router.get(
    "/google/callback",
    passport.authenticate("google", {
      failureRedirect: "http://localhost:3000/auth",
    }),
    async (req, res) => {
      res.redirect("http://localhost:3000/");
    }
  );
};
