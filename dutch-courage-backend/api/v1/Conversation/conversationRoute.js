/* This file contains routing for conversation models and functionalities */
import express from 'express' //import express

import {
  createConversation,
  deleteConversation,
  getConversation,
  getAllConversationsOfUser,
} from './conversationController.js' //import conversation controller

import { protect, restrictTo } from '../common/authController.js' //import Auth controller

const router = express.Router() //create router instance

router.use(protect, restrictTo('regularUser')) //protect all routes after this middleware
router.route('/getMyConversations').get(getAllConversationsOfUser) //route to get all conversations of logged in user
router.route('/').post(createConversation) //route to create a conversation
router.route('/:id').get(getConversation).delete(deleteConversation) //route to delete a conversation

export default router
