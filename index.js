const http = require('http');
const fs = require('fs');
const path = require('path');
const socketIO = require('socket.io');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error loading index.html');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

const io = socketIO(server);
const port = 5000;

io.on('connection', (socket) => {
    console.log('A user connected.');

    socket.on('send name', (user) => {
        console.log(`User: ${user}`);
        io.emit('send name', user);
    });

    socket.on('send message', (chat) => {
        console.log(`Message: ${chat}`);
        io.emit('send message', chat);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected.');
    });
});

server.listen(port, () => {
    console.log(`Server is listening at port: ${port}`);
});
