const createError = require("http-errors");
const CartModel = require("../models/cart");
const ProductModel = require("../models/product");
const OrderModel = require("../models/order");
const product = require("../routes/product");
const ConversionUtils = require("../utils/conversionUtils");
const stripe = require("stripe")(`${process.env.STRIPE_API_KEY}`);

const CartModelInstance = new CartModel();
const ProductModelInstance = new ProductModel();
const OrderModelInstance = new OrderModel();

module.exports = class CartService {
  async getCartItems(user_id) {
    try {
      const cartItems = await CartModelInstance.findAllByUserId(user_id);

      if (cartItems.length === 0) {
        throw createError(404, "No items found in your card");
      }

      let totalQuantity = 0;
      let totalPrice = 0;

      const updatedCartItems = await Promise.all(
        cartItems.map(async (cartItem) => {
          totalQuantity += cartItem.quantity;
          const product = await ProductModelInstance.findOneById(
            cartItem.product_id
          );
          const { id, ...details } = await product;
          totalPrice +=
            parseFloat(details.unit_price.slice(1)) * cartItem.quantity;
          return { ...cartItem, product_details: details };
        })
      );
      return {
        cart: updatedCartItems,
        totalQuantity,
        totalPrice: totalPrice.toFixed(2),
      };
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

      return { createdCartItem };
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
      throw createError(500, error);
    }
  }

  async create_checkout_session(user_id) {
    try {
      // getting the total amount to be paid
      const { totalPrice } = await this.getCartItems(user_id);

      const session = await stripe.checkout.sessions.create({
        ui_mode: "embedded",
        line_items: [
          {
            price_data: {
              currency: "gbp",
              product_data: {
                name: "Custom Payment",
              },
              unit_amount: 100 * parseFloat(totalPrice), // Amount in pence
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        return_url: `${process.env.MY_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
      });

      return { clientSecret: session.client_secret };
    } catch (error) {
      throw createError(500, error);
    }
  }

  async check_session_status(session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);

      return {
        status: session.status,
        customer_email: session.customer_details.email,
      };
    } catch (error) {
      throw createError(500, error);
    }
  }

  async checkout({ user_id, session_id }) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      if (session.status === "open") {
        return { status: "open" };
      }
      const { cart, totalPrice } = await this.getCartItems(user_id);

      const timestamp = new Date(Date.now()).toISOString().split("T")[0];

      // we assume order has been completed
      const order = {
        user_id,
        total_price: totalPrice,
        timestamp,
        order_status: "dispatched",
      };

      // create a new order and await created order object
      const createdOrder = await OrderModelInstance.create(order);

      // conrtructing the order_items
      const order_items = cart.map((cartItem) => {
        return {
          order_id: createdOrder.id,
          product_id: cartItem.product_id,
          quantity: cartItem.quantity,
          unit_price_at_purchase: ConversionUtils.convertCurrencyString(
            cartItem.product_details.unit_price
          ),
        };
      });

      //add order items to order_items table

      await Promise.all(
        order_items.map(async (order_item) => {
          await OrderModelInstance.createOrderItem(order_item);
        })
      );

      //clear the cart

      const creatredOrderProducts = await this.clearCart(user_id);

      // return the order

      return { status: "complete" };
    } catch (error) {
      throw createError(500, error);
    }
  }
};
