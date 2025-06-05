const db = require("../db");
const pgp = require("pg-promise")({ capSQL: true });

module.exports = class UserModel {
  /**
   *
   * @param {Object} data [User data]
   * @returns {Object|null} [Created user record]
   */
  async create(data) {
    try {
      // Generate SQL statement - using helper for dynamic parameter injection
      const statement =
        pgp.helpers.insert(data, null, "users") +
        "RETURNING id, email, role_id, telephone";

      //execute query
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
   * @param {Object} data [User data]
   * @returns {Object|null} [Updated User record]
   */
  async update(data) {
    try {
      const { id, ...params } = data;

      //Generates SQL statement - using helper for dynamic parameter injection
      const condition = pgp.as.format(
        "WHERE id = ${id} RETURNING id, email, telephone, first_name, last_name",
        { id }
      );
      const statement = pgp.helpers.update(params, null, "users") + condition;

      //Execute sql statement
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
   * @param {String} email [User email]
   * @returns {Object|null} [User record]
   */
  async findOneByEmail(email) {
    try {
      const statement =
        "SELECT users.id as id, users.email as email,users.password as password, users.telephone as telephone, roles.name as role FROM users JOIN roles ON users.role_id = roles.id WHERE email  = $1";
      const values = [email];

      //Execute SQL statement
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
   * @param {String} id [User Id]
   * @returns {Object|null} [User record]
   */
  async findOneById(id) {
    try {
      const statement =
        "SELECT users.id as id, users.email as email, users.first_name as first_name, users.last_name as last_name, users.telephone as telephone, roles.name as role FROM users JOIN roles ON users.role_id = roles.id WHERE users.id  = $1";
      const values = [id];

      //Execute SQL statement
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
   * Finds a user record by Google ID
   * @param  {String}      id [Google ID]
   * @return {Object|null}    [User Record]
   */
  async findOneByGoogleId(id) {
    try {
      // Generate SQL statement
      const statement = `SELECT users.id as id, users.email as email, users.first_name as first_name, users.last_name as last_name, users.telephone as telephone, roles.name as role FROM users JOIN roles ON users.role_id = roles.id WHERE google ->> 'id' = $1`;
      const values = [id];

      // Execute SQL statment
      const result = await db.query(statement, values);

      if (result.rows?.length) {
        return result.rows[0];
      }

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }
};
