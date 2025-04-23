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
            const statement = pgp.helpers.insert(data, null, "users") + "RETURNING id, email, role_id, telephone";

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
            const condition = pgp.as.format("WHERE id = ${id} RETURNING id, email, role_id, telephone", { id });
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
            const statement = "SELECT * FROM users WHERE email  = $1";
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
            const statement = "SELECT * FROM users WHERE id  = $1";
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
};
