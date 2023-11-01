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
connectDb();
// Peer Server
var ExpressPeerServer = require('peer').ExpressPeerServer;
var peerExpress = require('express');
var peerApp = peerExpress();
var peerServer = require('http').createServer(peerApp);
var options = { debug: true }
var peerPort = 3001;
peerApp.use('/peerjs', ExpressPeerServer(peerServer, options));
// cors 
app.use(cors(corsOptions));

// middlewares

// app.use(bodyParser.raw({type: "application/json"}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use("/redirect", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.redirect(`/${uuidv4()}`);
});


mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  peerServer.listen(peerPort, () => console.log(`Peer server now working on port ${peerPort}`));
});


