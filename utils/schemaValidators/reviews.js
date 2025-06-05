const { checkExact, checkSchema } = require("express-validator");

const getReviewsSchema = checkExact(
  checkSchema(
    {
      product_id: {
        notEmpty: {
          errorMessage: "product_id is required.",
        },
      },
    },
    ["params"]
  ),
  {
    message: "product_id is required",
  }
);

const reviewSchema = checkExact(
  checkSchema(
    {
      product_id: {
        notEmpty: {
          errorMessage: "product_id is required.",
        },
      },
      comment: {
        notEmpty: {
          errorMessage: "comment is required.",
        },
        escape: true,
      },

      rating: {
        notEmpty: {
          errorMessage: "rating is required.",
        },
        isInt: {
          errorMessage: "Invalid rating data",
        },
      },
    },
    ["params", "body"]
  ),
  {
    message: "product_id, comment and rating are required",
  }
);

module.exports = { getReviewsSchema, reviewSchema };
