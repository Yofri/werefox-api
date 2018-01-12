var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Before play begin
const role = {werewolf, villager}
let user = []

// Preparation befor playing
let userRole = []
let liveUser = []

let toBeExecute = []
let isstart = false;

io.on('connection', function(socket){

  //Ini ngemit socket.id ke client, fungsinya biar tau siapa yang ngirim
  socket.emit('userId', socket.id)

  //Ini ketika user masukkin username pertama kali
  socket.on('username', (username) => {
    if (username) {
      if (user.indexOf(username) == -1) {
        if (!isstart) {
          user.push({
            id: socket.id, 
            username: username
          })
        } else {
          socket.emit('errors', 'Game already started')
        }
      } else {
        socket.emit('errors', 'Username cannot empty')
      }
    } else {
      socket.emit('errors', 'Username already taken')

    }
  })

  //Ini ketika chatting
  socket.on('chat', message => {

    if (msg[0]!='/') {
      io.emit('chat', message);
    } else {
      if (msg == '/start') {
        isstart = true;
        liveUser = user
        let randNum = Math.floor(Math.random() * ((user.length-1) - 0)) + 0
        user[randNum].role = 'werewolf'
        for (var i = 0; i < user.length; i++) {
          if (i != randNum) {
            user[i].role = 'villager'
          }
        }
      } else if (msg == '/skill') {
        let arrMsg = msg.split('')
        let werewolf = ''
        for (var i = 0; i < user.length; i++) {
          if (Object.values(user[i]).indexOf('werewolf')) {
            werewolf = user[i].id
            break;
          }
        }
        //cek user tertentu itu werewolf atau bukan
        if (arrMsg[2] == werewolf) {
          for (var i = 0; i < user.length; i++) {
            if (Object.values(user[i]).indexOf(arrMsg[1])) {
              let killTarget = i
              break;
            }
          }
          user.splice(killTarget, 1)
        } else {
         //Voting eksekusi
         toBeExecute.push(arrMsg[1])
        }
      }
    }
  })

  //kalau malam, cek siapa tereksekusi paling banyak, nanti splice
  let counter = 0
  let index = 0
  for (var i = 0; i < toBeExecute.length; i++) {
    for (var j = 0; j < toBeExecute.length; j++) {
      if (toBeExecute[i] == toBeExecute[j]) {
        counter++
      }
    }
  }

  socket.on('disconnect', ()=>{
    

  })
  
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
    