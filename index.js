// Node server which will handle socket io connections
// we need socket.io at 8000 port , we are running a server socket.io (an http instance) at 8000 port
// const io = require('socket.io')(8000);  //this server listens to the incoming events

const express = require("express")
var app = express();
var server = app.listen(8000);
var io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
});     //some error occured with upar wala io tareeka toh yeh google se kiya

const users = {}     //for users

// io.on listens to the instance when user connects
io.on('connection', socket =>{
    // socket.on will tell if something happens to a connection then what will happen
    socket.on('new-user-joined', name =>{
        console.log("New user", name);
        // now we set the users id as its name and everyone else is informed as well that some user has joined
        users[socket.id]=name;
        // boradcast.emit() it tells eveyone about the event excpet the one joined
        socket.broadcast.emit('user-joined', name)
    }); 

    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    })
})