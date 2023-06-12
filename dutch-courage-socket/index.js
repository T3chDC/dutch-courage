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

// Function to get user from users array
const getUser = (userId) => {
  return users.find((user) => user.userId === userId)
}

io.on('connection', (socket) => {
  // When socket is connected
  console.log('A user connected:', socket.id)
  // Take userId and socketId from user on connection
  socket.on('addUser', (userId) => {
    addUser(userId, socket.id)
    io.emit('getUsers', users)
  })

  // Send and get message
  socket.on(
    'sendMessage',
    ({
      conversationId,
      senderId,
      receiverId,
      messageType,
      message,
      messageImageUrl,
      createdAt,
    }) => {
      const reciever = getUser(receiverId)
      io.to(reciever.socketId).emit('getMessage', {
        conversationId,
        senderId,
        messageType,
        message,
        messageImageUrl,
        createdAt,
      })
    }
  )

  // When socket is disconnected
  socket.on('disconnect', () => {
    console.log('A user disconnected!')
    // Remove user from users array on disconnect
    removeUser(socket.id)
    io.emit('getUsers', users)
  })
})
