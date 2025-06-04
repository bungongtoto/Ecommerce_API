const db = require("../db");
const pgp = require("pg-promise")({ capSQL: true });

module.exports = class OrderModel {
  async create(data) {
    try {
      const statement =
        pgp.helpers.insert(data, null, "orders") + "RETURNING *";

      const results = await db.query(statement);

      if (results.rows?.length) {
        return results.rows[0];
      }

      return null;
    } catch (error) {
      throw error;
    }
  }

  async update(data) {
    try {
      const { id, ...params } = data;
      const condition = pgp.as.format(" WHERE id = ${id} RETURING *", { id });
      const statement = pgp.helpers.update(params, null, "orders") + condition;

      const results = await db.query(statement);

      if (results.rows?.length) {
        return results.rows[0];
      }

      return null;
    } catch (error) {
      throw error;
    }
  }

  async findAllByUserId(user_id) {
    try {
      const statement =
        "SELECT id, order_status, to_char(total_price::numeric, '£999G999D00') AS total_price, timestamp FROM orders WHERE user_id = $1";
      const values = [user_id];

      const results = await db.query(statement, values);

      if (results.rows?.length) {
        return results.rows;
      }

      return [];
    } catch (error) {
      throw error;
    }
  }

  async findOneByIdAndUserId(data) {
    try {
      const { id, user_id } = data;
      const statement =
        "SELECT id, order_status, to_char(total_price::numeric, '£999G999D00') AS total_price, timestamp FROM orders WHERE id = $1 AND user_id = $2";
      const values = [id, user_id];

      const results = await db.query(statement, values);

      if (results.rows?.length) {
        return results.rows[0];
      }

      return null;
    } catch (error) {
      throw error;
    }
  }

  async createOrderItem(data) {
    try {
      const statement =
        pgp.helpers.insert(data, null, "order_items") + "RETURNING *";

      const results = await db.query(statement);

      if (results.rows?.length) {
        return results.rows;
      }

      return null;
    } catch (error) {
      throw error;
    }
  }

  async findOrderItems(order_id) {
    try {
      const statement =
        "SELECT order_id, product_id, quantity, to_char( unit_price_at_purchase::numeric, '£999G999D00') AS  unit_price_at_purchase  FROM order_items WHERE order_id = $1";
      const values = [order_id];

      const results = await db.query(statement, values);

      if (results.rows?.length) {
        return results.rows;
      }

      return [];
    } catch (error) {
      throw error;
    }
  }
};
