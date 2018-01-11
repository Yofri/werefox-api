var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const user = []

io.on('connection', function(socket){
  socket.on('username', (username) => {
    if (user.indexOf(username) == -1 ) {
      if (username) {
        user.push(username)
      } else {
        socket.emit('error', 'Username cannot empty')
      }
    } else {
      socket.emit('error', 'Username already taken')
    }
  })
  socket.on('chat', message => {
    io.emit('chat', message);
  })
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
    