const express = require('express');
const router = express.Router();

const UserService = require('../services/userService');
const UserServiceInstance = new UserService();

module.exports = (app) => {
    app.use('/users', router);

    router.get('/', async (req, res, next) => {
        try {
            const response = await UserServiceInstance.get({ id: req.user.id });

            res.send(response);
        } catch (error) {
            next(error);
        }
    });

    router.put('/', async (req, res, next) => {
        try {
            const data = req.body;
            const response = await UserServiceInstance.update({id: req.user.id, ...data});

            res.send(response);
        } catch (error) {
            next(error);
        }
    });

    router.put('/address', async (req, res, next) => {
        try {
            const data = {user_id: req.user.id, ...req.body};
            const response = await UserServiceInstance.setAddress(data);

            res.send(response);
        } catch (error) {
            next(error);
        }
    });


}