// import and configure dotenv
require('dotenv').config()

const PORT = process.env.PORT || 5001

const io = require('socket.io')(PORT, {
  cors: {
    origin: '*',
  },
})

let users = []

// Function to add user to users array
const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId })
}

// Function to remove user from users array
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId)
}

io.on('connection', (socket) => {
  console.log('A user connected')
  // Take userId and socketId from user on connection
  socket.on('addUser', (userId) => {
    addUser(userId, socket.id)
    io.emit('getUsers', users)
  })

  socket.on('disconnect', () => {
    console.log('A user disconnected!')
    // Remove user from users array on disconnect
    removeUser(socket.id)
    io.emit('getUsers', users)
  })
})
