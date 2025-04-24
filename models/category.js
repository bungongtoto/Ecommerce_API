const db = require('../db');
const pgp = require('pg-promise')({ capSQL: true });

module.exports = class CategoryModel {
    /**
     * 
     * @param {Object} data [Object]
     * @returns {Object|null} [category record]
     */
    async create(data) {
        try {
            const statement = pgp.helpers.insert(data, null, 'categories') + "RETURNING *";

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
     * @param {Object} data [category data]
     * @returns {Object|null} [category updated record]
     */
    async update(data) {
        try {
            const { id, ...params } = data;

            const condition = pgp.as.format("WHERE id = ${id} RETURNING *", { id });
            const statement = pgp.helpers.update(params, null, 'categories') + condition;

            const results = await db.query(statement);

            if (results.rows?.length) {
                return results.rows[0];
            }

            return null;
        } catch (error) {
            throw error;
        }
    }

    // /**
    //  * 
    //  * @param {String} id [category id]
    //  * @returns 
    //  */
    // async deleteById(id){
    //     try {
    //         const statement = "DELETE FROM categories WHERE id = $1 RETURNING *";
    //         const values = [id]

    //         const results = await db.query(statement, values);

    //         if (results.rows?.length) {
    //             return results.rows[0];
    //         }

    //         return null;
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    /**
         * 
         * @param {String} id [category id]
         * @returns {Object|null} [category records]
         */
    async findOneById(id) {
        try {
            const statement = "SELECT * FROM categories WHERE id = $1";
            const values = [id]

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
     * @returns {Array[Object]|null} [list of categories records]
     */
    async getAll() {
        try {
            const statement = "SELECT * FROM categories";

            const results = await db.query(statement);

            if (results.rows?.length) {
                return results.rows;
            }

            return null;
        } catch (error) {
            throw error;
        }
    }
}