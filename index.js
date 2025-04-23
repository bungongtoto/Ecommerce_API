require("dotenv").config();
const express = require("express");
const app = express();
const { PORT } = require('./config');
const loaders = require('./loaders')


async function startServer() {

    //Init application loaders
    loaders(app);

    //starts server
    app.listen(PORT, () => {
        console.log(`App running and listerning on PORT ${PORT}`)
    });
}


startServer()
