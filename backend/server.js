/* 
  This file contains all the server configurations and functionalities.
*/

import app from './config/app.js' //import the express app
import connectDB from './config/db.js' //import the db connection

connectDB() //connect to the database

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
})
