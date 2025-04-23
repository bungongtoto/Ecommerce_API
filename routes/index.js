const authRouter = require('./auth');
const userRouter = require('./user')
const AuthorizationUtils = require('../utils/middlewares/AuthorizationUtils');
const AuthorizationUtilsInstance = new AuthorizationUtils()

module.exports = (app, passport) => {
    authRouter(app, passport);

    //This middleware make sures only authorized users access the routes ahead.
    app.use(AuthorizationUtilsInstance.isAuthenticated);

    userRouter(app);

}