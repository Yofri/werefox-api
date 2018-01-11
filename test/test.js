const socket = require('socket.io-client')("http://localhost:3000");

let testEmit = 'hellow'

test('chat message emitted',()=>{
  socket.on('connection', () =>{
    
  })
  socket.emit('chat', 'Hello World')
    console.log('helolhleheolo');
    socket.on('chat', (msg)=>{
      console.log(msg);
      testEmit = msg
      console.log(testEmit);
      expect(testEmit).toMatch('hello');
    })
    
})

test('invalid username (empty) validated', ()=>{
  socket.emit('username',undefined, (msg)=> {
    socket.on('error', (err)=>{
      expect(err).toBe("Username cannot empty")
    })
  })
})
// 
// test('expect to return array of player names', ()=>{
//   socket.emit('arrayPlayers', ['user1','user2','user3','user4','user5'], (array)=> {
//     socket.on('arrayPlayers', (array)=>{
//       expect(array).toBe(['user1','user2','user3','user4','user6'])
//     })
//   })
// })

// test('expect to return 3 fox' , () =>[
//  socket.emit('arrayPlayers', ['user1','user2','user3','user4','user5'], (array)=>{
//    let role = Math.floor(Math.random() * ((array.length-1) - 1)) + 1;
//     array[role] = 'fox'
//     expect(array[role]).toBe('fox');
//    }) 
// ])

// test('1+1 = 3', () =>{
//   console.log('hellow')
//   expect(1+1).toBe(2)
// })


  
