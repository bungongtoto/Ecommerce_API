const { checkExact, checkSchema } = require("express-validator");

const productSchame = checkExact(
  checkSchema(
    {
      name: {
        trim: true,
        escape: true,
        notEmpty: {
          errorMessage: "name is required",
        },
      },
      unit_price: {
        notEmpty: {
          errorMessage: "unit_price is required",
        },
        isFloat: {
          errorMessage: "Invalid price value",
        },
      },
      description: {
        optional: true,
        trim: true,
        escape: true,
      },
      qauntity: {
        notEmpty: {
          errorMessage: "quantity is required",
        },
        isNumeric: {
          errorMessage: "Invalid quantity value",
        },
      },
      category_id: {
        isNumeric: {
          errorMessage: "Invalid category_id",
        },
        notEmpty: {
          errorMessage: "category_id is required",
        },
      },
    },
    ["body"]
  ),
  {
    message: "name, unit_price, quantity, category_id are required",
  }
);

const updateProductSchame = checkExact(
  checkSchema(
    {
      product_id: {
        notEmpty: {
          errorMessage: "product_id parameter required.",
        },
        isNumeric: {
          errorMessage: "Invalid product Id parameter",
        },
      },
      name: {
        trim: true,
        escape: true,
        optional: true,
      },
      unit_price: {
        optional: true,
        isFloat: {
          errorMessage: "Invalid price value",
        },
      },
      description: {
        optional: true,
        trim: true,
        escape: true,
      },
      qauntity: {
        optional: true,
        isNumeric: {
          errorMessage: "Invalid quantity value",
        },
      },
      category_id: {
        isNumeric: {
          errorMessage: "Invalid category_id",
        },
        optional: true,
      },
    },
    ["body", "params"]
  ),
  {
    message: "name, unit_price, quantity, category_id,description are possible",
  }
);

const productImageSchema = checkExact(
  checkSchema(
    {
      product_id: {
        isNumeric: {
          errorMessage: "Invalid product_id value.",
        },
        notEmpty: {
          errorMessage: "product_id is required.",
        },
      },
      image_url: {
        notEmpty: {
          errorMessage: "image_url is required.",
        },
        isURL: {
          options: {
            require_protocol: true,
          },
          errorMessage: "image_url must be a valid URL",
        },
      },
    },
    ["body", "params"]
  ),
  {
    message: "product_id and image_url required.",
  }
);

const updateProductImageSchema = checkExact(
  checkSchema(
    {
      id: {
        isNumeric: {
          errorMessage: "Invalid id value.",
        },
        notEmpty: {
          errorMessage: "id is required.",
        },
      },
      product_id: {
        isNumeric: {
          errorMessage: "Invalid product_id value.",
        },
        notEmpty: {
          errorMessage: "product_id is required.",
        },
      },
      image_url: {
        notEmpty: {
          errorMessage: "image_url is required.",
        },
        isURL: {
          options: {
            require_protocol: true,
          },
          errorMessage: "image_url must be a valid URL",
        },
      },
    },
    ["body", "params"]
  ),
  {
    message: "id, product_id and image_url required.",
  }
);

const deleteProductImageSchema = checkExact(
  checkSchema(
    {
      id: {
        isNumeric: {
          errorMessage: "Invalid id value.",
        },
        notEmpty: {
          errorMessage: "id is required.",
        },
      },
      product_id: {
        isNumeric: {
          errorMessage: "Invalid product_id value.",
        },
        notEmpty: {
          errorMessage: "product_id is required.",
        },
      },
    },
    ["params"]
  ),
  {
    message: "id and product_id is required.",
  }
);

module.exports = {
  productSchame,
  updateProductSchame,
  productImageSchema,
  updateProductImageSchema,
  deleteProductImageSchema,
};
