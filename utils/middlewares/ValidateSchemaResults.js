const { validationResult } = require("express-validator");

const ValidateSchemaResult = async (req, res, next) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const newResult = result.array().map((err) => err.msg);
      res.status(400).send({ error: newResult });
      return;
    } else {
      return next();
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { ValidateSchemaResult };
