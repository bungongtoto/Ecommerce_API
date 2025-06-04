const { checkExact, checkSchema } = require("express-validator");

const orderSchema = checkExact(
  checkSchema(
    {
      order_id: {
        notEmpty: {
          errorMessage: "order_id is required.",
        },
      },
    },
    ["params"]
  ),
  {
    message: "order_id is required",
  }
);

module.exports = { orderSchema };
