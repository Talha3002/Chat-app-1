const express = require('express');
const app = express();
const http = require('http').createServer(app);

const port = 3000;

http.listen(port, () => {
    console.log(`server running on port ${port}`);
})
app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

const io = require('socket.io')(http);

io.on('connection', socket => {
    console.log("Connected");

    socket.on('user-joined', (Name) => {
        console.log(`${Name} has joined the chat`);
        socket.broadcast.emit('user-joined', Name);
    });

    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg);
    });

    socket.on('disconnected', (Name) => {
        console.log(`${Name} has disconnected`);
        socket.broadcast.emit('disconnected', Name);
    });
});