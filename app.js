var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const user = []

io.on('connection', function(socket){
  console.log('hello hello');
  socket.on('username', (username) => {
    if (username) {
      user.push(username)
    } else {
      console.log('masuk emit');
      let errMsg = 'Username cannot empty'
      socket.emit('gagal', errMsg)
    }
    if (user.indexOf(username) == -1 ) {

    } else {
      socket.emit('gagal2', 'Username already taken')
    }
  })
  socket.on('chat', message => {
    console.log('masuk chat' , message);
    io.emit('chat', message);
  })
  
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
    