const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = "ChatBot";

// Run when client connects
io.on('connect', (socket) => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // Welcome current user
        socket.emit('message', formatMessage(botName, 'Welcome!'));

        // Broadcast when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));
    });

    // Listen for chatMessage
    socket.on('chatMessage', (message) => {
        io.emit('message', formatMessage('USER', message));
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(botName, `A user has left the chat`));
    });

});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));