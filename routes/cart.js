const express = require("express");
const router = express.Router();
const AuthorizationUtils = require("../utils/middlewares/AuthorizationUtils");
const AuthorizationUtilsInstance = new AuthorizationUtils();
const {
  cartItemSchema,
  deleteCartItemSchema,
  checkoutSchema,
} = require("../utils/schemaValidators/cart");
const {
  ValidateSchemaResult,
} = require("../utils/middlewares/ValidateSchemaResults");

const CartService = require("../services/CartService");
const CartServiceInstance = new CartService();

module.exports = (app) => {
  app.use("/cart", AuthorizationUtilsInstance.isAuthenticated, router);

  router.get("/", async (req, res, next) => {
    try {
      const response = await CartServiceInstance.getCartItems(req.user.id);
      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  });

  router.post(
    "/",
    cartItemSchema,
    ValidateSchemaResult,
    async (req, res, next) => {
      try {
        const data = { user_id: req.user.id, ...req.body };
        const response = await CartServiceInstance.addToCart(data);

        res.status(201).send(response);
      } catch (error) {
        next(error);
      }
    }
  );

  router.put(
    "/product/:product_id",
    cartItemSchema,
    ValidateSchemaResult,
    async (req, res, next) => {
      try {
        const { product_id } = req.params;
        const data = { user_id: req.user.id, product_id, ...req.body };
        console.log(data);

        const response = await CartServiceInstance.updateCartItem(data);

        res.status(200).send(response);
      } catch (error) {
        next(error);
      }
    }
  );

  router.delete("/", async (req, res, next) => {
    try {
      const response = await CartServiceInstance.clearCart(req.user.id);

      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  });

  router.delete(
    "/product/:product_id",
    deleteCartItemSchema,
    ValidateSchemaResult,
    async (req, res, next) => {
      try {
        const { product_id } = req.params;
        const data = { user_id: req.user.id, product_id };

        const response = await CartServiceInstance.removeCartItem(data);

        res.status(200).send(response);
      } catch (error) {
        next(error);
      }
    }
  );

  router.post("/create-checkout-session", async (req, res, next) => {
    try {
      const response = await CartServiceInstance.create_checkout_session(
        req?.user.id
      );

      res.send(response);
    } catch (error) {
      next(error);
    }
  });

  //   router.get("/session-status", async (req, res) => {
  //     const response = await CartServiceInstance.check_session_status(
  //       req.query.session_id
  //     );

  //     res.send(response);
  //   });

  router.get(
    "/checkout",
    checkoutSchema,
    ValidateSchemaResult,
    async (req, res, next) => {
      try {
        const response = await CartServiceInstance.checkout({
          user_id: req.user.id,
          session_id: req.query.session_id,
        });

        res.status(200).send(response);
      } catch (error) {
        next(error);
      }
    }
  );
};
