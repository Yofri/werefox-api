var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var CronJob = require('cron').CronJob;
// new CronJob('* */2 * * * *', function() {
//   console.log('You will see this message every second');
// }, null, true, 'Asia/Jakarta');





// Before play begin
// const role = {werewolf, villager}
let user = []

// Preparation befor playing

let werewolfId = ''
let villagerId = []

let toBeExecute = []
let isstart = false;
let isDay = false
let timeZone = 'Asia/Jakarta'


io.on('connection', function(socket){
  var job = new CronJob('* */2 * * * *', function() {
    console.log('cron jalan');
     isDay = !isDay
     console.log(isDay);
     socket.emit('isDay', isDay)
     socket.broadcast.emit('isDay', isDay)
     user.forEach(u=>{
       if(u.role == 'werewolf'){
         werewolfId = u.id
         
       }
       else{
         villagerId.push(u.id)
         
       }
     })
     if(isDay){
       let liveUser = []
       user.forEach(u => {
         liveUser.push(u.username)
       })
       socket.emit('chat', '|Daftar pemain yang masih hidup'+liveUser)
       socket.broadcast.emit('chat', '|Daftar pemain yang masih hidup'+liveUser)
       socket.emit('chat', `|Silahkan diskusi untuk menentukan werewolf`)
       socket.broadcast.emit('chat', `|Silahkan diskusi untuk menentukan werewolf`)
       villagerId.forEach(warga=>{
         io.to(warga).emit('chat', '|Ketik /skill (username) untuk mengeksekusi teman kalian')
       })
     }
     else{
       socket.emit('chat', '|Malam sudah tiba, hati-hati werewolf')
       socket.broadcast.emit('chat', '|Malam sudah tiba, hati-hati werewolf')
       io.to(werewolfId).emit('chat','|Ketik /skill (username) untuk memburu teman kalian')
     }
     if(user.length == 2){
      //  job.stop()
     }
    }, function () {
      /* This function is executed when the job stops */
      isstart = false
      socket.emit('chat', "|Game Over")
      socket.broadcast.emit('chat', "|Game Over")
      
      let winner = ''
      user.forEach(pemain=>{
        if(pemain.role != 'werewolf'){
          winner = '|Villager wins!'
        }
        else{
          winner = "|Werewolf is the winner"
        }
      })
      socket.emit('chat', winner)
      socket.broadcast.emit('chat', winner)
      
    },
    false, /* Start the job right now */
    timeZone /* Time zone of this job. */
  );



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
          socket.emit('errors', '|Game already started')
        }
      } else {
        socket.emit('errors', '|Username cannot empty')
      }
    } else {
      socket.emit('errors', '|Username already taken')

    }
  })

  //Ini ketika chatting
  socket.on('chat', msg => {

    if (msg.split('|')[1][0]!='/') {
      io.emit('chat', msg);
    } else {
      if (msg == '/start') {
        job.start()
        isstart = true;
        liveUser = user
        let randNum = Math.floor(Math.random() * ((user.length-1) - 0)) + 0
        user[randNum].role = 'werewolf'
        for (var i = 0; i < user.length; i++) {
          if (i != randNum) {
            user[i].role = 'villager'
          }
        }
        console.log(user);
        socket.emit('chat', '|Game started')
        socket.broadcast.emit('chat', '|Game started')
        
        villagerId.forEach(warga=>{
          io.to(warga).emit('chat', '|Kamu adalah villager!')
        })
        io.to(werewolfId).emit('chat','|Kamu adalah werewolf!')
      } else if (msg.split('|')[1] == '/skill') {
        //skill abis itu namanya user
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
          socket.emit('chat', '|Skill telah digunakan')
        } else {
         //Voting eksekusi
         toBeExecute.push(arrMsg[1])
         setTimeout(function () {
           let counter = 0
           let index = 0
           let max = 0
           for (var i = 0; i < toBeExecute.length; i++) {
             for (var j = i; j < toBeExecute.length; j++) {
               if (toBeExecute[i] == toBeExecute[j]) {
                 counter++
               }
               if(counter > max){
                 max = counter
                 index = i
               }
             }
             counter = 0
           }
           socket.broadcast.emit('chat', `|${user[index].username} telah dimecinin`)
           user.splice(index , 1)
          }, 60000)
         //kalau malam, cek siapa tereksekusi paling banyak, nanti splice
         
         socket.emit('chat', '|Kamu telah voting untuk mengeksekusi')
        }
      }
    }
  })
  
  socket.on('disconnect', ()=>{
    

  })
  
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
    