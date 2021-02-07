const socketio = require('socket.io')
const io  = socketio()
const random = require('../helper/randomColor')
const SocketApi = { }
SocketApi.io = io
const users = {}

io.on('connection' , (socket) => {
    console.log('Foydalanuvchi boglandi')
    socket.on('newUser' , (data) => { ///asdfasfasddfadf
        console.log(data)
         const defaultData = {
             id: socket.id,
             position: {
                 x: 0,
                 y: 0
             },
             color: random()
         }
        
         const userData = Object.assign(data , defaultData)
        //  users.push(userData)
         users[socket.id] = userData
        //  console.log(users)
        socket.broadcast.emit('newUser' ,  users[socket.id] )
         
        socket.emit('initPlayer' , users)

         socket.on('disconnect' , () => {
            socket.broadcast.emit('disUser' , users[socket.id])
            console.log(users)
            delete users[socket.id]
            console.log(users)
         })
         socket.on('position'  ,(data) => {
             console.log(users)
             users[socket.id].position.x = data.x
             users[socket.id].position.y = data.y
             console.log(users)
             socket.broadcast.emit('animate' , {
                 socketId : socket.id,
                 x: data.x,
                 y: data.y
             })
         })
    })

})


module.exports = SocketApi