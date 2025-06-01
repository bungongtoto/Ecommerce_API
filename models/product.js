const db = require("../db");
const pgp = require("pg-promise")({ capSQL: true });

module.exports = class ProductModel {
  /**
   *
   * @param {Object} data [product data]
   * @returns {Object|null} [product record]
   */
  async create(data) {
    try {
      const statement =
        pgp.helpers.insert(data, null, "products") + "RETURNING *";

      const results = await db.query(statement);

      if (results.rows?.length) {
        return results.rows[0];
      }

      return null;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param {Object} data [product data]
   * @returns {Object|null} [updated product record]
   */
  async update(data) {
    try {
      const { id, ...params } = data;

      const condition = pgp.as.format("WHERE id = ${id} RETURNING *", { id });
      const statement =
        pgp.helpers.update(params, null, "products") + condition;

      const results = await db.query(statement);

      if (results.rows?.length) {
        return results.rows[0];
      }

      return null;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param {String} id [product id]
   * @returns {Object|null} [product records]
   */
  async findOneById(id) {
    try {
      // const statement = "SELECT * FROM products WHERE id = $1";
      const statement =
        "SELECT p.id AS id, p.name AS name, to_char(p.unit_price::numeric, '£999G999D00') AS unit_price, p.description AS description, p.quantity AS quantity,  p.category_id AS category_id, COALESCE((SELECT json_agg(pi) FROM product_images pi WHERE pi.product_id = p.id), '[]') AS images, ROUND(COALESCE((SELECT AVG(pr.rating) FROM product_reviews pr WHERE pr.product_id = p.id ),0),1) AS average_rating, (SELECT COUNT(*) FROM product_reviews pr WHERE pr.product_id = p.id) AS rating_count FROM products p WHERE p.id = $1";
      const values = [id];

      const results = await db.query(statement, values);

      if (results.rows?.length) {
        return results.rows[0];
      }

      return null;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @returns {Array[Object]|null} [list of product records]
   */
  async getAll() {
    try {
      // const statement = "SELECT * FROM products";
      const statement =
        "SELECT p.id AS id, p.name AS name, to_char(p.unit_price::numeric, '£999G999D00') AS unit_price, p.description AS description, p.quantity AS quantity,  p.category_id AS category_id, COALESCE((SELECT json_agg(pi) FROM product_images pi WHERE pi.product_id = p.id), '[]') AS images, ROUND(COALESCE((SELECT AVG(pr.rating) FROM product_reviews pr WHERE pr.product_id = p.id ),0),1) AS average_rating, (SELECT COUNT(*) FROM product_reviews pr WHERE pr.product_id = p.id) AS rating_count FROM products p ORDER BY average_rating DESC";
      const results = await db.query(statement);

      if (results.rows?.length) {
        return results.rows;
      }

      return null;
    } catch (error) {
      throw error;
    }
  }

  async getPopular() {
    try {
      // const statement = "SELECT * FROM products";
      const statement =
        "SELECT p.id AS id, p.name AS name, to_char(p.unit_price::numeric, '£999G999D00') AS unit_price, p.description AS description, p.quantity AS quantity,  p.category_id AS category_id, COALESCE((SELECT json_agg(pi) FROM product_images pi WHERE pi.product_id = p.id), '[]') AS images, ROUND(COALESCE((SELECT AVG(pr.rating) FROM product_reviews pr WHERE pr.product_id = p.id ),0),1) AS average_rating, (SELECT COUNT(*) FROM product_reviews pr WHERE pr.product_id = p.id) AS rating_count FROM products p ORDER BY average_rating DESC LIMIT 20";
      const results = await db.query(statement);

      if (results.rows?.length) {
        return results.rows;
      }

      return null;
    } catch (error) {
      throw error;
    }
  }
  /**
   *
   * @param {String} category_id [category id]
   * @returns {Array[Object]} [list of products with category_id]
   */
  async getAllByCategoryId(category_id) {
    try {
      // const statement = "SELECT * FROM products WHERE category_id = $1";
      const statement =
        "SELECT p.id AS id, p.name AS name, to_char(p.unit_price::numeric, '£999G999D00') AS unit_price, p.description AS description, p.quantity AS quantity,  p.category_id AS category_id, COALESCE((SELECT json_agg(pi) FROM product_images pi WHERE pi.product_id = p.id), '[]') AS images, ROUND(COALESCE((SELECT AVG(pr.rating) FROM product_reviews pr WHERE pr.product_id = p.id ),0),1) AS average_rating, (SELECT COUNT(*) FROM product_reviews pr WHERE pr.product_id = p.id) AS rating_count FROM products p WHERE p.category_id = $1  ORDER BY average_rating DESC";
      const values = [category_id];

      const results = await db.query(statement, values);

      if (results.rows?.length) {
        return results.rows;
      }

      return null;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param {Object} data [Object]
   * @returns {Object|null} [new product image record]
   */
  async addImage(data) {
    try {
      const statement =
        pgp.helpers.insert(data, null, "product_images") + "RETURNING *";

      const results = await db.query(statement);

      if (results.rows?.length) {
        return results.rows[0];
      }

      return null;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param {Object} data [Object]
   * @returns {Object|null} [updated image record]
   */
  async updateImage(data) {
    try {
      const { id, product_id, ...params } = data;

      const condition = pgp.as.format(
        "WHERE id = ${id} AND product_id = ${product_id} RETURNING *",
        { id, product_id }
      );
      const statement =
        pgp.helpers.update(params, null, "product_images") + condition;

      const results = await db.query(statement);

      if (results.rows?.length) {
        return results.rows[0];
      }

      return null;
    } catch (error) {
      throw error;
    }
  }

  async deleteImage(data) {
    try {
      const { id, product_id } = data;
      const statement =
        "DELETE FROM product_images WHERE id = $1 AND product_id = $2 RETURNING *";
      const values = [id, product_id];

      const results = await db.query(statement, values);

      if (results.rows?.length) {
        return results.rows[0];
      }

      return null;
    } catch (error) {
      throw error;
    }
  }

  async findReviewsByProductId(product_id) {
    try {
      const statement =
        "SELECT pv.product_id AS product_id, pv.rating AS rating, pv.comment as comment, pv.timestamp as timestamp, json_build_object('user_id', pv.user_id, 'first_name', u.first_name, 'last_name',u.last_name) AS user FROM product_reviews pv LEFT JOIN users u ON pv.user_id = u.id WHERE pv.product_id = $1";
      const values = [product_id];

      const results = await db.query(statement, values);

      if (results.rows?.length) {
        return results.rows;
      }

      return null;
    } catch (error) {
      throw error;
    }
  }

  async findOneReview(data) {
    try {
      const { product_id, user_id } = data;
      const statement =
        "SELECT * FROM product_reviews WHERE user_id = $1 AND product_id = $2";
      const values = [user_id, product_id];

      const results = await db.query(statement, values);

      if (results.rows?.length) {
        return results.rows[0];
      }

      return null;
    } catch (error) {
      throw error;
    }
  }

  async createReview(data) {
    try {
      const statement =
        pgp.helpers.insert(data, null, "product_reviews") + "RETURNING *";

      const results = await db.query(statement);

      if (results.rows?.length) {
        return results.rows[0];
      }

      return null;
    } catch (error) {
      throw error;
    }
  }

  async updateReview(data) {
    try {
      const { product_id, user_id, ...params } = data;
      const condition = pgp.as.format(
        "WHERE user_id = ${user_id} AND product_id = ${product_id}  RETURNING *",
        { user_id, product_id }
      );
      const statement =
        pgp.helpers.update(params, null, "product_reviews") + condition;

      const results = await db.query(statement);

      if (results.rows?.length) {
        return results.rows[0];
      }

      return null;
    } catch (error) {
      throw error;
    }
  }
};
