const { checkExact, checkSchema } = require("express-validator");

const cartItemSchema = checkExact(
  checkSchema(
    {
      product_id: {
        notEmpty: {
          errorMessage: "product_id is required.",
        },
        isInt: {
          errorMessage: "Invalid product_id value.",
        },
      },
      quantity: {
        notEmpty: { errorMessage: "quantity is required" },
        isInt: {
          errorMessage: "Invalid quantity value most be atleast 1",
        },
      },
    },
    ["body", "params"]
  ),
  {
    message: "product_id and quantity required.",
  }
);

const deleteCartItemSchema = checkExact(
  checkSchema(
    {
      product_id: {
        notEmpty: {
          errorMessage: "product_id is required.",
        },
        isInt: {
          errorMessage: "Invalid product_id value.",
        },
      },
    },
    ["params"]
  ),
  {
    message: "product_id is required",
  }
);

const checkoutSchema = checkExact(
  checkSchema(
    {
      session_id: {
        notEmpty: {
          errorMessage: "session_id is required.",
        },
      },
    },
    ["query"]
  ),
  {
    message: "session_id is required",
  }
);

module.exports = { cartItemSchema, deleteCartItemSchema, checkoutSchema };
