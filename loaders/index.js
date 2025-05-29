const expressLoader = require("./express");
const passportLoader = require("./passport");
const routeLoader = require("../routes");
const swaggerLoader = require("./swagger");

module.exports = async (app) => {
  //Loads express middleware
  const expressApp = await expressLoader(app);

  //Loads passport middleware

  const passport = await passportLoader(expressApp);

  //Load API routes  handles
  await routeLoader(app, passport);

  //Load Swagger docs
  await swaggerLoader(app);

  await // Error Handler
  app.use((err, req, res, next) => {
    const { message, status } = err;

    return res.status(status || 500).send({ error: message });
  });
};
