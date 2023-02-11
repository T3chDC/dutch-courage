// This file contains the routes for the version 1.0 of the API
import express from 'express'
import userRouter from '../user/userRoutes.js' //import user routes

const router = express.Router()

router.use('/users', userRouter)

router.route('/').get((req, res) => {
  res.status(200).json({
    message:
      'This is version 1.0 of the API, If you want to use version n.0, please use /api/vn (n = version number))',
  })
})

export default router
