/* 
  This file contains all the server configurations and functionalities.
*/

import app from './config/app.js' //import the express app
import connectDB from './config/db.js' //import the db connection

//handling uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...')
  console.log(err.name, err.message)
  process.exit(1)
})

connectDB() //connect to the database

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
})

//handling unhandles rejection
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...')
  console.log(err.name, err.message)
  server.close(() => {
    process.exit(1)
  })
})
