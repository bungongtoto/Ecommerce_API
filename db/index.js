const { Pool } = require('pg')
const { DB } = require('../config')


const pool = new Pool({
    user: DB.PG_USER,
    password: DB.PG_PASSWORD,
    host: DB.PG_HOST,
    port: DB.PG_PORT,
    database: DB.PG_DATABASE
})

module.exports = {
    query: (text, params) => pool.query(text, params)
}