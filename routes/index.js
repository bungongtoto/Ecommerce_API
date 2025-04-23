const authRouter = require('./auth');

module.exports = (app, passport) => {
 authRouter(app, passport);
}