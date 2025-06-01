const { checkExact, checkSchema } = require("express-validator");

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

module.exports = { addressSchema, updateUserSchema };
