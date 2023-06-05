/* This file contains the logic for handling requests and communicating with the messages data model*/

import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'
import Message from './messageModel.js'

import { deleteOne } from '../common/handlerFactory.js' //import generic handler

// @desc    Create message
// @route   POST /api/v1/messages
// @access  Private/regularUser
export const createMessage = catchAsync(async (req, res, next) => {

  //Check if the number of messages per participant in a conversation is not more than 10
  const messageCount = await Message.countDocuments({
    conversationId: req.body.conversationId,
    sender: req.body.sender,
  })

  if (messageCount >= 10) {
    return next(
      new AppError(
        'You have reached the maximum number of messages allowed per conversation',
        429
      )
    )
  }

  //Create message
  const newMessage = await Message.create(req.body)

  if (!newMessage) {
    return next(new AppError('Could not create message', 429))
  }

  res.status(201).json({
    status: 'success',
    data: newMessage,
  })
})

// @desc    Delete a specific message
// @route   DELETE /api/v1/messages/:id
// @access  Private/regularUser
export const deleteMessage = deleteOne(Message)
