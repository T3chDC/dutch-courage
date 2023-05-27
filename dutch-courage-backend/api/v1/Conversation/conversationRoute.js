/* This file contains routing for conversation models and functionalities */
import express from 'express' //import express

import {
  createConversation,
  getAllConversationsOfUser,
} from './conversationController.js' //import conversation controller

import { protect, restrictTo } from '../common/authController.js' //import Auth controller

const router = express.Router() //create router instance

router.use(protect, restrictTo('regularUser')) //protect all routes after this middleware
router.route('/').post( createConversation) //route to create a conversation
router
  .route('/getMyConversations')
  .get( getAllConversationsOfUser) //route to get all conversations of a user

export default router
