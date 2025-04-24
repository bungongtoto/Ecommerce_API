const express = require('express');
const router = express.Router();

const CategoryService = require('../services/CategoryService');
const CategoryServiceInstance = new CategoryService()

module.exports = (app) => {
    app.use('/categories', router);

    router.get('/', async (req, res, next) => {
        try {
            const response = await CategoryServiceInstance.getALl();

            res.status(200).send(response);
        } catch (error) {
            next(error);
        }
    });

    router.post('/', async (req, res, next) => {
        try {
            const response = await CategoryServiceInstance.create(req.body);

            res.status(201).send(response);
        } catch (error) {
            next(error);
        }
    });

    router.put('/:id', async(req, res, next) => {
        try {
            const {id} = req.params;
            const data = {id, ...req.body};

            const response = await CategoryServiceInstance.update(data);

            res.status(200).send(response);
        } catch (error) {
            next(error);
        }
    });
}