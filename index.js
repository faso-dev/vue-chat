// express instance app
const app = require('express')();
// load static file
const serveStatic = require('serve-static');
// create http server
const http = require('http').createServer(app);
// create socket.io instance
const io = require('socket.io')(http);
// server listen port
const port = process.env.PORT || 8080;
app.use(serveStatic(__dirname + "/dist"));

// listen on connection
io.on('connection', async (socket) => {
    io.emit('setOnlineUsers', Object.keys(io.sockets.connected).length);
    //Listing when user join the chat chanel
    socket.on('joinChat', (data) => {
        socket.broadcast.emit('joinChat', (data));
    });
    //Listing when user send message
    socket.on('sendMessage', data => {
        socket.broadcast.emit('sendMessage', (data));
    });
    //Listing when user is typing
    socket.on('typingNotification', data => {
        socket.broadcast.emit('typingNotification', (data));
    })
});

http.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
