/*
  This file contains all the express functionalities
  and global middlewares with configurations.
*/

import dotenv from 'dotenv' //import dotenv
dotenv.config() //load the .env file

import express from 'express' //import express from express
import cors from 'cors' //import cors for CROSS-ORIGIN-RESOURCE-SHARING

const app = express() //create an instance of express

app.use(cors()) //enable cors

app.use(express.json()) //enable json parsing

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API is running...', app: 'dutch-courage' })
})

export default app
