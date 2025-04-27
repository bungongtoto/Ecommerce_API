const createError = require('http-errors');
const OrderModel = require('../models/order');
const ProductModel = require("../models/product");
const ProductModelInstance = new ProductModel();
const OrderModelInstance = new OrderModel();

module.exports = class OrderService {
    async getOrders(user_id){
        try {
            const orders = await OrderModelInstance.findAllByUserId(user_id);

            if (orders.length === 0){
                throw createError(404,"No Orders found");
            }

            return orders;

        } catch (error) {
            throw createError(500, error);
        }
    }

    async getOrderByIdAndUserId(data){
        try {
            const order = await OrderModelInstance.findOneByIdAndUserId(data);

            if(!order){
                throw createError(404, "Order not Found");
            }

            const order_items = await this.getOrderItems(data.id);

            const updatedOrder = {...order, order_items}

            return updatedOrder;
        } catch (error) {
            throw createError(500, error);
        }
    }

    async getOrderItems(order_id){
        try {
            const order_items = await OrderModelInstance.findOrderItems(order_id);

            // if (order_items.length === 0){
            //     throw createError(404, "No order items for this order");
            // }

            const order_items_with_details = await Promise.all(
                order_items.map(async (order_item) =>{
                    const {id, unit_price,...product} = await ProductModelInstance.findOneById(order_item.product_id);

                    return {...order_item, ...product};
                })
            );

            return order_items_with_details;
        } catch (error) {
            throw createError(500, error);
        }
    }
}