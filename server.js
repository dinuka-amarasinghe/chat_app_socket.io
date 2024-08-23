const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const formatMessage = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = "ChatBot";

// Run when client connects
io.on('connect', (socket) => {

    // Welcome the current user
    socket.emit('message', formatMessage(botName, 'Welcome!'));

    // Broadcast when a user connects
    socket.broadcast.emit('message', formatMessage(botName, 'A user has joined the chat'));

    // Runs when client disconnects
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(botName, 'A user has left the chat'));
    });

    // Listen for chatMessage
    socket.on('chatMessage', (message) => {
        io.emit('message', formatMessage('USER', message));
    });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));