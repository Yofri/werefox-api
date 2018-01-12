const socket = require('socket.io-client')("http://localhost:3000");

// let testEmit = 'hellow'
global.console = {
  warn: jest.fn(),
  log: jest.fn()
}

test('chat message emitted',()=>{
  socket.on('connection', () =>{
    
  })
  socket.emit('chat', 'Hello World')
    
    // console.log('helolhleheolo');
    socket.on('chat',async (msg)=>{
      // console.log(msg);
      const testEmit = await msg
      // console.log(testEmit);
      expect(testEmit).toBe('Hello World');
    })
})

test('invalid username (empty) validated', ()=>{
  // console.log('masuk invalid username test');
  socket.on('connection', () =>{})
  socket.emit('username','player1')
    socket.on('gagal', async (err)=>{
      const testErr = await err
      // console.log(testErr);
      expect(testErr).toBe("Username cannot empty")
    })
})
// 

test('at game start, array of players must contain property role' , () =>{
  socket.on('connection', () =>{})
  
  // socket.emit('gameStart')
    socket.on('gameStart', async (users) =>{
      const usersArray = await users
      for(let i = 0 ; i < usersArray.length ; i++){
        expect(usersArray[i]).objectContaining({
          role : expect.not.toMatch('')
        })
      }
  })
})


test('emit userId when player is connected', () =>{
  socket.on('connection', ()=>{})
  socket.on('userId' , async (id)=>{
    const checkUserId = await id
    expect(checkUserId).not.toMatch('')
  })
})

test('expect client to pass /skill',()=>{
  socket.on('connection', ()=>{})
  socket.on('useSkill', async (data)=>{
    const checkSkill = await data
    expect(checkSkill).not.toMatch('')
  })
})

test('expect user to use appropriate skill', ()=>{
  socket.on('connection' , ()=>{})
  socket.on('useSkill', async(data)=>{
    const userRole = data
    
  })
})

test('expect cron to start when game start', ()=>{
  socket.on('connection', ()=>{})
  socket.emit('username','player1')
  socket.emit('chat', '/start')
  socket.on('chat', async (msg)=>{
    const checkMsg = await msg
    console.log(msg);
      expect(global.console.log).toHaveBeenCalledWith('cron jalan')
  })
})

test('expect cron to emit day status to client', ()=>{
  socket.on('connection' , ()=>{})
  socket.emit('username','player1')
  socket.on('isDay', async (status)=>{
    const checkStatus = await status
    expect(checkStatus).toBe(true || false)
  })
})



  
