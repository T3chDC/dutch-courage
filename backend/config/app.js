/*
  This file contains all the express functionalities
  and global middlewares with configurations.
*/

import path from 'path' //import path for folder locationing

import dotenv from 'dotenv' //import dotenv
dotenv.config() //load the .env file

import express from 'express' //import express from express
import cors from 'cors' //import cors for CROSS-ORIGIN-RESOURCE-SHARING

import globalErrorHandler from '../api/v1/utils/errorController.js' //import global error handler
import AppError from '../api/v1/utils/appError.js' //import appError for error report creation

import v1Router from '../api/v1/common/v1Routes.js' //import v1Router from v1Routes.js

const app = express() //create an instance of express

app.use(cors()) //enable cors

app.use(express.json()) //enable json parsing

app.use('/api/v1', v1Router) //use v1Router for /api/v1

//serve static files
const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API is running...', app: 'dutch-courage' })
})

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
})

app.use(globalErrorHandler) //use global error handler

export default app
