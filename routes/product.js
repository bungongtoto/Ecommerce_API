const express = require("express");
const router = express.Router();
const { matchedData } = require("express-validator");

const {
  ValidateSchemaResult,
} = require("../utils/middlewares/ValidateSchemaResults");

const {
  productSchame,
  updateProductSchame,
  productImageSchema,
  updateProductImageSchema,
  deleteProductImageSchema,
} = require("../utils/schemaValidators/product");

const ProductService = require("../services/ProductService");
const ProductServiceInstance = new ProductService();

const AuthorizationUtils = require("../utils/middlewares/AuthorizationUtils");
const AuthorizationUtilsInstance = new AuthorizationUtils();

module.exports = (app) => {
  app.use("/products", router);

  //get products by category_id path "/products?category_id=1"
  router.get("/", async (req, res, next) => {
    try {
      let response = null;
      if (req.query.category_id) {
        response = await ProductServiceInstance.getAllByCategoryId(
          req.query.category_id
        );
      } else {
        response = await ProductServiceInstance.getAll();
      }

      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  });

  router.get("/popular", async (req, res, next) => {
    try {
      const response = await ProductServiceInstance.getPopular();

      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  });

  router.get("/:product_id", async (req, res, next) => {
    try {
      const { product_id } = req.params;

      const response = await ProductServiceInstance.getOneById(product_id);

      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  });

  router.post(
    "/",
    productSchame,
    ValidateSchemaResult,
    AuthorizationUtilsInstance.isAuthenticated,
    AuthorizationUtilsInstance.isAdmin,
    async (req, res, next) => {
      try {
        const data = matchedData(req);
        const response = await ProductServiceInstance.create(data);

        res.status(200).send(response);
      } catch (error) {
        next(error);
      }
    }
  );

  router.put(
    "/:product_id",
    updateProductSchame,
    ValidateSchemaResult,
    AuthorizationUtilsInstance.isAuthenticated,
    AuthorizationUtilsInstance.isAdmin,
    async (req, res, next) => {
      try {
        const { product_id: id } = req.params;

        const data = { id, ...req.body };

        const response = await ProductServiceInstance.update(data);

        res.status(200).send(response);
      } catch (error) {
        next(error);
      }
    }
  );

  router.post(
    "/:product_id/images",
    productImageSchema,
    ValidateSchemaResult,
    AuthorizationUtilsInstance.isAuthenticated,
    AuthorizationUtilsInstance.isAdmin,
    async (req, res, next) => {
      try {
        const { product_id } = req.params;
        const data = { product_id, ...req.body };

        const response = await ProductServiceInstance.addImage(data);

        res.status(201).send(response);
      } catch (error) {
        next(error);
      }
    }
  );

  router.put(
    "/:product_id/images/:id",
    updateProductImageSchema,
    ValidateSchemaResult,
    AuthorizationUtilsInstance.isAuthenticated,
    AuthorizationUtilsInstance.isAdmin,
    async (req, res, next) => {
      try {
        const { product_id, id } = req.params;
        const data = { product_id, id, ...req.body };

        const response = await ProductServiceInstance.updateImage(data);

        res.status(201).send(response);
      } catch (error) {
        next(error);
      }
    }
  );

  router.delete(
    "/:product_id/images/:id",
    deleteProductImageSchema,
    ValidateSchemaResult,
    AuthorizationUtilsInstance.isAuthenticated,
    AuthorizationUtilsInstance.isAdmin,
    async (req, res, next) => {
      try {
        const { product_id, id } = req.params;
        const response = await ProductServiceInstance.deleteImage({
          product_id,
          id,
        });

        res.status(200).send(response);
      } catch (error) {
        next(error);
      }
    }
  );

  router.post("/:product_id/reviews", async (req, res, next) => {
    try {
      const { product_id } = req.params;
      const data = { product_id, user_id: req.user.id, ...req.body };

      const response = await ProductServiceInstance.createReview(data);

      res.status(201).send(response);
    } catch (error) {
      next(error);
    }
  });

  router.put("/:product_id/reviews", async (req, res, next) => {
    try {
      const { product_id } = req.params;
      const data = { product_id, user_id: req.user.id, ...req.body };

      const response = await ProductServiceInstance.updateReview(data);

      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  });

  router.get("/:product_id/reviews", async (req, res, next) => {
    try {
      const { product_id } = req.params;
      const response = await ProductServiceInstance.getAllReviewByProductId(
        product_id
      );

      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  });
};
