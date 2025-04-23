const db = require('../db');
const pgp = require('pg-promise')({ capSQL: true });


module.exports = class AddressModel {
    /**
     * 
     * @param {Object} data [address date]
     * @returns {Object|null} [address record]
     */
    async create(data) {
        try {
            // generate sql query using helpers for dynamic parameter injection
            const statement = pgp.helpers.insert(data, null, 'addresses') + "RETURNING *"

            // Execute query
            const results = await db.query(statement);

            if (results.rows?.length){
                return results.rows[0];
            }

            return null;
        } catch (error) {
            throw error;
        }
    }


    /**
     * 
     * @param {Object} data [address data]
     * @returns {Object|null} [address record]
     */
    async update(data) {
        try {
            const {id, ...params} = data;
            const condition = pgp.as.format("WHERE id = ${id} RETURNING *",{id} );
            const statement = pgp.helpers.update(params, null, 'addresses') + condition;

            const results = await db.query(statement);

            if (results.rows?.length){
                return results.rows[0];
            }

            return null;
        } catch (error) {
            throw error;
        }
    }


    /**
     * 
     * @param {String} user_id [user id]
     * @returns {Object|null} [address record]
     */
    async findOneByUserId(user_id) {
        try {
            const statement = 'SELECT  * FROM addresses WHERE user_id = $1';
            const values = [user_id]

            const results = await db.query(statement, values);

            if (results.rows?.length){
                return results.rows[0];
            }

            return null;
        } catch (error) {
            throw error;
        }
    }
}