const express = require('express');
const router = express.Router();

module.exports = (app) => {
    app.use('/users', router);

    router.get('/',  async (req, res, next) => {
        res.send(`Hello, I am Authorized, my email is ${req.user?.email}`)
    });
}