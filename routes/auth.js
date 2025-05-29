const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const AuthService = require("../services/AuthService");
const AuthorizationUtils = require("../utils/middlewares/AuthorizationUtils");
const {
  matchedData,
  validationResult,
  checkSchema,
  checkExact,
} = require("express-validator");

const AuthServiceInstance = new AuthService();
const AuthorizationUtilsInstance = new AuthorizationUtils();

//Schema validations to validate and sanitize inputs
const registerSchema = checkExact(
  checkSchema(
    {
      email: {
        isEmail: {
          errorMessage: "Must be a valid email address",
        },
        trim: true,
      },
      password: {
        isLength: {
          options: { min: 8 },
          errorMessage: "password must be atleast 8 characters",
        },
      },
    },
    ["body"]
  ),
  {
    message: "email and password required",
  }
);

const loginSchema = checkExact(
  checkSchema(
    {
      username: {
        isEmail: {
          errorMessage: "username  most be a valid email address",
        },
        trim: true,
      },
      password: {
        notEmpty: true,
      },
    },
    ["body"]
  ),
  {
    message: "username and password required",
  }
);

module.exports = (app, passport) => {
  app.use("/auth", router);

  //registration Endpoint
  router.post("/register", registerSchema, async (req, res, next) => {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        const newResult = result.array().map((err) => err.msg);
        res.status(400).send({ error: newResult });
        return;
      }

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
  });

  //Login Endpoint
  router.post(
    "/login",
    loginSchema,
    passport.authenticate("local"),
    async (req, res, next) => {
      try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
          const newResult = result.array().map((err) => err.msg);
          res.status(400).send({ error: newResult });
          return;
        }
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
  router.get(
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
};
