const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const session = require("express-session");
const { SESSION_SECRET, SESSION_TABLE_NAME } = require("../config");
const Pool = require("../db");
const pgSession = require("connect-pg-simple")(session);

module.exports = (app) => {
  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  // add morgan middleware for logging request
  app.use(morgan("dev"));

  // body-parser middleware to add body object to request
  app.use(bodyParser.json());
  //parses url encoded bodies
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );

  app.set("trust proxy", 1);

  //creates a session

  app.use(
    session({
      store: new pgSession({
        pool: Pool.pool,
        tableName: SESSION_TABLE_NAME,
      }),
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        //secure is used to determine if the cookie is sent to server if it is https or http
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
      },
    })
  );

  return app;
};
