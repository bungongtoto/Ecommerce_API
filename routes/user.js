const express = require("express");
const router = express.Router();
const AuthorizationUtils = require("../utils/middlewares/AuthorizationUtils");
const { matchedData } = require("express-validator");
const {
  ValidateSchemaResult,
} = require("../utils/middlewares/ValidateSchemaResults");

const {
  updateUserSchema,
  addressSchema,
} = require("../utils/schemaValidators/user");

const UserService = require("../services/userService");
const UserServiceInstance = new UserService();
const AuthorizationUtilsInstance = new AuthorizationUtils();

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

  router.put(
    "/",
    updateUserSchema,
    ValidateSchemaResult,
    async (req, res, next) => {
      try {
        const data = matchedData(req);
        const response = await UserServiceInstance.update({
          id: req.user.id,
          ...data,
        });

        res.send(response);
      } catch (error) {
        next(error);
      }
    }
  );

  router.put(
    "/address",
    addressSchema,
    ValidateSchemaResult,
    async (req, res, next) => {
      try {
        const data = matchedData(req);
        const response = await UserServiceInstance.setAddress({
          user_id: req.user.id,
          ...data,
        });

        res.send(response);
      } catch (error) {
        next(error);
      }
    }
  );
};
