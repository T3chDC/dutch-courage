// import and configure dotenv
require('dotenv').config()

const PORT = process.env.PORT || 5001

const io = require('socket.io')(PORT, {
  cors: {
    origin: '*',
  },
})

io.on('connection', (socket) => {
  console.log('A user connected')
})
