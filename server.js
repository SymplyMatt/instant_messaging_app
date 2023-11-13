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
const { v4: uuidv4 } = require("uuid");
const connectSocket = require('./config/socketConnection')(server);
const path = require('path');
connectDb();

// cors 
app.use(cors(corsOptions));

// middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use("/redirect", express.static(__dirname + "/public"));


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});



