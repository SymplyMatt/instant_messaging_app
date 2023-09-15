require("dotenv").config();
const express = require("express");
const app = express();
const credentials = require("./middleware/credentials");
app.use(credentials);
const mongoose = require("mongoose");
const PORT = process.env.PORT || 8000;
const connectDb =require('./config/dbConnect');
const methodOverride = require('method-override');
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const cookieParser = require('cookie-parser');
const axios = require('axios');
const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io');

const connectSocket = require('./config/socketConnection')(server);
connectDb();


// cors 
app.use(cors(corsOptions));

// middlewares

// app.use(bodyParser.raw({type: "application/json"}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use("/redirect", express.static(__dirname + "/public"));



mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
