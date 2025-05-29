const express = require("express");
const router = express.Router();
const AuthorizationUtils = require("../utils/middlewares/AuthorizationUtils");
const {
  matchedData,
  validationResult,
  checkSchema,
  checkExact,
} = require("express-validator");

const UserService = require("../services/userService");
const UserServiceInstance = new UserService();
const AuthorizationUtilsInstance = new AuthorizationUtils();

//shema validation for user update route
const updateUserSchema = checkExact(
  checkSchema(
    {
      first_name: {
        notEmpty: true,
        escape: true,
        errorMessage: "first_name cannot be null.",
      },

      last_name: {
        notEmpty: true,
        escape: true,
        errorMessage: "last_name cannot be null.",
      },
      telephone: {
        trim: true,
        notEmpty: true,
        isMobilePhone: {
          options: ["en-GB"],
          errorMessage: "Invalid Uk Number.",
        },
      },
    },
    ["body"]
  ),
  {
    message: " first_name, last_name and telephone are required",
  }
);

//validating and sanitizing address input

const addressSchema = checkExact(
  checkSchema(
    {
      post_code: {
        notEmpty: {
          errorMessage: "post_code is required.",
        },
        trim: true,
        isPostalCode: {
          options: "GB",
          errorMessage: "Please Enter a valid UK postCode.",
        },
      },
      city: {
        notEmpty: {
          errorMessage: "city is required",
        },
        trim: true,
        escape: true,
      },
      address_line: {
        notEmpty: {
          errorMessage: "address_line is required",
        },
        trim: true,
        escape: true,
      },
    },
    ["body"]
  ),
  {
    message: "post_code, city and address_line required.",
  }
);

module.exports = (app) => {
  app.use("/user", AuthorizationUtilsInstance.isAuthenticated, router);

  router.get("/", async (req, res, next) => {
    try {
      const response = await UserServiceInstance.get({ id: req.user.id });

      res.send(response);
    } catch (error) {
      next(error);
    }
  });

  router.put("/", updateUserSchema, async (req, res, next) => {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        const newResult = result.array().map((err) => err.msg);
        res.status(400).send({ error: newResult });
        return;
      }

      const data = matchedData(req);
      const response = await UserServiceInstance.update({
        id: req.user.id,
        ...data,
      });

      res.send(response);
    } catch (error) {
      next(error);
    }
  });

  router.put("/address", addressSchema, async (req, res, next) => {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        const newResult = result.array().map((err) => err.msg);
        res.status(400).send({ error: newResult });
        return;
      }
      const data = matchedData(req);
      const response = await UserServiceInstance.setAddress({
        user_id: req.user.id,
        ...data,
      });

      res.send(response);
    } catch (error) {
      next(error);
    }
  });
};
