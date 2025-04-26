const express  = require('express');
const router = express.Router();

const CartService = require('../services/CartService');
const CartServiceInstance = new CartService();

module.exports = (app) => {
    app.use('/cart', router);

    router.get('/',async (req,res, next) => {
        try {
            const response =  await CartServiceInstance.getCartItems(req.user.id);
            res.status(200).send(response);
        } catch (error) {
            next(error);
        }
    });
        
    router.post('/', async (req, res, next) => {
        try {
            const data = {user_id: req.user.id, ...req.body};
            const response = await CartServiceInstance.addToCart(data);

            res.status(201).send(response);
        } catch (error) {
            next(error);
        }
    });

    router.put('/product/:product_id', async(req, res, next) => {
        try {
            const {product_id} = req.params;
            const data = {user_id: req.user.id, product_id, ...req.body};

            const response = await CartServiceInstance.updateCartItem(data);

            res.status(200).send(response);
            
        } catch (error) {
            next(error);
        }
    });

    router.delete('/', async (req, res, next) => {
        try {
            const response = await CartServiceInstance.clearCart(req.user.id);

            res.status(200).send(response);
        } catch (error) {
            next(error);
        }
    });

    router.delete('/product/:product_id', async (req, res, next) => {
        try {
            const {product_id} = req.params;
            const data = {user_id: req.user.id, product_id};

            const response = await CartServiceInstance.removeCartItem(data);

            res.status(200).send(response);
        } catch (error) {
            next(error);
        }
    });
}