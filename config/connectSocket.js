const express = require("express");
const app = express();
const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
function connectSocket () {
    // Set up event handlers for Socket.IO connections
    io.on('connection', (socket) => {
        console.log('A user connected', socket.id);
    
        socket.on('disconnect', async() => {
        try {
            console.log('a user disconnected');
        } catch (error) {
            console.log(error);
            socket.emit('error', error.message);
        }
        
        });
    })
} 

module.export = connectSocket