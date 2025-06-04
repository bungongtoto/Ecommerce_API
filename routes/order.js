const express = require("express");
const router = express.Router();
const OrderService = require("../services/OrderService");
const AuthorizationUtils = require("../utils/middlewares/AuthorizationUtils");
const AuthorizationUtilsInstance = new AuthorizationUtils();

const { orderSchema } = require("../utils/schemaValidators/orders");
const {
  ValidateSchemaResult,
} = require("../utils/middlewares/ValidateSchemaResults");

const OrderServiceInstance = new OrderService();

module.exports = (app) => {
  app.use("/orders", AuthorizationUtilsInstance.isAuthenticated, router);

  router.get("/", async (req, res, next) => {
    try {
      const response = await OrderServiceInstance.getOrders(req.user.id);

      res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  });

  router.get(
    "/:order_id",
    orderSchema,
    ValidateSchemaResult,
    async (req, res, next) => {
      try {
        const { order_id } = req.params;
        const data = { user_id: req.user.id, id: order_id };

        const response = await OrderServiceInstance.getOrderByIdAndUserId(data);

        res.status(200).send(response);
      } catch (error) {
        next(error);
      }
    }
  );

  router.get(
    "/:order_id/items",
    AuthorizationUtilsInstance.isAdmin,
    async (req, res, next) => {
      try {
        const { order_id } = req.params;
        const response = await OrderServiceInstance.getOrderItems(order_id);

        res.status(200).send(response);
      } catch (error) {
        next(error);
      }
    }
  );
};
