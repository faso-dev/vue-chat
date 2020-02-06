// express instance app
const app = require('express')();
// load static file
const serveStatic = require('serve-static');
// create http server
const http = require('http').createServer(app);
// create socket.io instance
const io = require('socket.io')(http);
// server listen port
const port = process.env.PORT || 4000;
app.use(serveStatic(__dirname + "/dist"));

// listen on connection
io.on('connection', async (socket) => {
    //Listing when user join the chat chanel
    socket.on('joinChat', (data) => {
        socket.broadcast.emit('joinChat', (data));
        socket.broadcast.emit('updateOnlineUsers');
    });
    //Listing when user send message
    socket.on('sendMessage', data => {
        socket.broadcast.emit('sendMessage', (data));
    });
    //Listing when user is typing
    socket.on('typingNotification', data => {
        socket.broadcast.emit('typingNotification', (data));
    });
    //Listing when user leave the chat chanel
    socket.on('unJoinChat', data => {
        socket.broadcast.emit('unJoinChat', (data));
    });
});
http.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
