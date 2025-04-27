const db = require('../db');
const pgp = require('pg-promise')({ capSQL: true });

module.exports = class CartModel {
    async create(data) {
        try {
            const statement = pgp.helpers.insert(data, null, 'cart') + "RETURNING *";

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
            const { product_id, user_id, ...params } = data;
            const condition = pgp.as.format(" WHERE user_id = ${user_id} AND product_id = ${product_id} RETURNING *", { user_id, product_id });
            const statement = pgp.helpers.update(params, null, 'cart') + condition;

            const results = await db.query(statement);

            if (results.rows?.length) {
                return results.rows[0];
            }

            return null;
        } catch (error) {
            throw error;
        }
    }

    async findAllByUserId(user_id){
        try {
            const statement = "SELECT * FROM cart WHERE user_id = $1";
            const values = [user_id];

            const results = await db.query(statement, values);

            if (results.rows?.length){
                return results.rows;
            }

            return [];
        } catch (error) {
            throw error;
        }
    }

    async findOneByUserIdProductId(data){
        try {
            const {user_id, product_id} = data;
            const statement = "SELECT * FROM cart WHERE user_id = $1 AND product_id = $2";
            const values = [user_id, product_id];

            const results = await db.query(statement, values);

            if (results.rows?.length){
                return results.rows[0];
            }

            return null;
        } catch (error) {
            throw error;
        }
    }

    async deleteAllByUserId(user_id) {
        try {
            const statement = "DELETE FROM cart WHERE user_id = $1 RETURNING *";
            const values = [user_id];

            const results = await db.query(statement, values);

            if (results.rows?.length){
                return results.rows;
            }

            return [];

        } catch (error) {
            throw error;
        }
    }

    async deleteOneByUserIdProductId(data){
        try {
            const {user_id, product_id} = data;
            const statement = "DELETE FROM cart WHERE user_id = $1 AND product_id = $2 RETURNING *";
            const values = [user_id, product_id];

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