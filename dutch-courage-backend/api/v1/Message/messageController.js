/* This file contains the logic for handling requests and communicating with the messages data model*/

import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'
import Message from './messageModel.js'

import {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} from '../common/handlerFactory.js' //import generic handler

// @desc    Create message
// @route   POST /api/v1/messages
// @access  Private/regularUser
export const createMessage = createOne(Message)

// @desc    Delete a specific message
// @route   DELETE /api/v1/messages/:id
// @access  Private/regularUser
export const deleteMessage = deleteOne(Message)

