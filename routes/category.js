const express = require("express");
const router = express.Router();
const AuthorizationUtils = require("../utils/middlewares/AuthorizationUtils");

const CategoryService = require("../services/CategoryService");
const CategoryServiceInstance = new CategoryService();
const AuthorizationUtilsInstance = new AuthorizationUtils();

module.exports = (app) => {
  app.use("/categories", router);

  router.get("/", async (req, res, next) => {
    try {
      const response = await CategoryServiceInstance.getALl();

      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  });

  router.post(
    "/",
    AuthorizationUtilsInstance.isAuthenticated,
    AuthorizationUtilsInstance.isAdmin,
    async (req, res, next) => {
      try {
        const response = await CategoryServiceInstance.create(req.body);

        res.status(201).send(response);
      } catch (error) {
        next(error);
      }
    }
  );

  router.put(
    "/:id",
    AuthorizationUtilsInstance.isAuthenticated,
    AuthorizationUtilsInstance.isAdmin,
    async (req, res, next) => {
      try {
        const { id } = req.params;
        const data = { id, ...req.body };

        const response = await CategoryServiceInstance.update(data);

        res.status(200).send(response);
      } catch (error) {
        next(error);
      }
    }
  );
};
