const createError = require("http-errors");
const CartModel = require("../models/cart");
const ProductModel = require("../models/product");
const OrderModel = require("../models/order");
const product = require("../routes/product");
const ConversionUtils = require('../utils/conversionUtils');

const CartModelInstance = new CartModel();
const ProductModelInstance = new ProductModel();
const OrderModelInstance = new OrderModel();


module.exports = class CartService {
    async getCartItems(user_id) {
        try {
            const cartItems = await CartModelInstance.findAllByUserId(user_id);

            if (!cartItems){
                throw createError(404, "No items found in your card")
            } 

            const updatedCartItems =  await Promise.all(
                cartItems.map(async (cartItem) => {
                    const product = await ProductModelInstance.findOneById(cartItem.product_id);
                    const {id, quantity, ...details} = await product;
                    return {...cartItem, product_details: details}
                })
            );
            return updatedCartItems;
        } catch (error) {
            throw createError(500, error);
        }
    }
    async addToCart(data) {
        try {
            const cartItem = await CartModelInstance.findOneByUserIdProductId(data);

            if (cartItem) {
                throw createError(409, "Product already in cart");
            }

            const createdCartItem = await CartModelInstance.create(data);

            if (!createdCartItem) {
                throw createError(500, "Internal Server Error");
            }

            return createdCartItem;
        } catch (error) {
            throw createError(500, error);
        }
    }

    async updateCartItem(data) {
        try {
            const cartItem = await CartModelInstance.findOneByUserIdProductId(data);

            if (!cartItem) {
                throw createError(404, "cart item not found");
            }

            const updatedItem = await CartModelInstance.update(data);

            if (!updatedItem) {
                throw createError(500, "Internal Server error");
            }

            return updatedItem;
        } catch (error) {
            throw createError(500, error);
        }
    }

    async removeCartItem(data) {
        try {
            const cartItem = await CartModelInstance.findOneByUserIdProductId(data);

            if (!cartItem) {
                throw createError(404, "cart item not found");
            }

            const deletedCartItem =
                await CartModelInstance.deleteOneByUserIdProductId(data);

            if (!deletedCartItem) {
                throw createError(500, "Internal server Error");
            }

            return deletedCartItem;
        } catch (error) {
            throw createError(500, error);
        }
    }

    async clearCart(user_id) {
        try {
            const cartItems = await CartModelInstance.deleteAllByUserId(user_id);

            if (!cartItems) {
                throw createError(500, "Internal server error");
            }

            return cartItems;
        } catch (error) {
            throw (500, error);
        }
    }

    async checkout(user_id){
        try {
            const cartItems = await this.getCartItems(user_id);
            let total_price = 0;
            //computing the total price
            cartItems.forEach(cartItem => {
                total_price += (cartItem.quantity * ConversionUtils.convertCurrencyString(cartItem.product_details.unit_price));
            });
            const timestamp = new Date(Date.now()).toISOString().split('T')[0];

            // we assume order has been completed
            const order = {user_id, total_price, timestamp, order_status: "dispatched"};

            // create a new order and await created order object
            const createdOrder = await OrderModelInstance.create(order);

            //assume payment went through and created a  transaction and shipment

            // conrtructing the order_items
            const order_items = cartItems.map(cartItem => {
                return {order_id: createdOrder.id, product_id: cartItem.product_id, quantity: cartItem.quantity, unit_price_at_purchase: ConversionUtils.convertCurrencyString(cartItem.product_details.unit_price)}
            });

            //add order items to order_items table

            await Promise.all(
                order_items.map( async (order_item) => {
                    await OrderModelInstance.createOrderItem(order_item);
                })
            )

            //clear the cart

            const creatredOrderProducts = await this.clearCart(user_id);

            // return the order

            return {order_items: creatredOrderProducts}

        } catch (error) {
            throw createError(500, error);
        }
    }
};
