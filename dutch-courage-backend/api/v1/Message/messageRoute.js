/* This file contains routing for conversation models and functionalities */
import express from 'express' //import express

import {
  createMessage,
  deleteMessage,
} from './messageController.js' //import message controller

import { protect, restrictTo } from '../common/authController.js' //import Auth controller

const router = express.Router() //create router instance

// router.use(protect, restrictTo('regularUser')) //protect all routes after this middleware
router.route('/').post(createMessage) //route to create a message
router.route('/:id').delete(deleteMessage) //route to delete a message

export default router