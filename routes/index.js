const authRouter = require('./auth');
const userRouter = require('./user');
const productRouter = require('./product');
const categoryRouter = require('./category');
const cartRouter = require('./cart');
const orderRouter = require('./order');

const AuthorizationUtils = require('../utils/middlewares/AuthorizationUtils');
const AuthorizationUtilsInstance = new AuthorizationUtils();

module.exports = (app, passport) => {
    authRouter(app, passport);

    //This middleware make sures only authorized users access the routes ahead.
    app.use(AuthorizationUtilsInstance.isAuthenticated);

    userRouter(app);
    productRouter(app);
    cartRouter(app);
    orderRouter(app)
    //add for wish list

    // This middleware makes sure only admin can access it
    app.use(AuthorizationUtilsInstance.isAdmin);
    categoryRouter(app);

}