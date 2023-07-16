// This file contains the routes for the version 1.0 of the API
import express from 'express'
import userRouter from '../user/userRoutes.js' //import user routes
import conversationRouter from '../Conversation/conversationRoute.js' //import conversation routes
import messageRouter from '../Message/messageRoute.js' //import message routes
import uploadRouter from './uploadRoutes.js' //import upload routes
import locationRouter from '../location/locationRoute.js' //import location routes

const router = express.Router()

router.use('/users', userRouter)
router.use('/conversations', conversationRouter)
router.use('/messages', messageRouter)
router.use('/upload', uploadRouter)
router.use('/location', locationRouter)

router.route('/').get((req, res) => {
  res.status(200).json({
    message:
      'This is version 1.0 of the API, If you want to use version n.0, please use /api/vn (n = version number))',
  })
})

export default router
