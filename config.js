module.exports = {
    PORT: process.env.PORT,
    DB: {
        PG_USER: process.env.PG_USER,
        PG_PASSWORD: process.env.PG_PASSWORD,
        PG_DATABASE: process.env.PG_DATABASE,
        PG_HOST: process.env.PG_HOST,
        PG_PORT: process.env.PG_PORT
    },
    SESSION_SECRET: process.env.SESSION_SECRET,
    SESSION_TABLE_NAME: process.env.SESSION_TABLE_NAME
}