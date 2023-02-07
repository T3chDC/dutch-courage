/* 
  This file contains all the server configurations and functionalities.
*/

import app from './config/app.js' //import the express app

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
})
