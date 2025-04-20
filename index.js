require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require("morgan");


const PORT = process.env.PORT || 3500;

app.use(cors());

// add morgan middleware for logging request
app.use(morgan('dev'))

// body-parser middleware to add body object to request
app.use(bodyParser.json());

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.listen(PORT, () => {
    console.log(`App running and listerning on PORT ${PORT}`)
});

