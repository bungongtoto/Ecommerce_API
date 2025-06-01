const { checkExact, checkSchema } = require("express-validator");

//Schema validations to validate and sanitize inputs
const registerSchema = checkExact(
  checkSchema(
    {
      email: {
        isEmail: {
          errorMessage: "Must be a valid email address",
        },
        trim: true,
      },
      password: {
        isLength: {
          options: { min: 8 },
          errorMessage: "password must be atleast 8 characters",
        },
      },
    },
    ["body"]
  ),
  {
    message: "email and password required",
  }
);

const loginSchema = checkExact(
  checkSchema(
    {
      username: {
        isEmail: {
          errorMessage: "username  most be a valid email address",
        },
        trim: true,
      },
      password: {
        notEmpty: true,
      },
    },
    ["body"]
  ),
  {
    message: "username and password required",
  }
);

module.exports = { registerSchema, loginSchema };
