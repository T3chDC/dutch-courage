/* This file contains the logic for handling requests and communicating with the conversations data model*/

import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'
import Conversation from './conversationModel.js'

import {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} from '../common/handlerFactory.js' //import generic handler

// @desc    Create conversation
// @route   POST /api/v1/connversations
// @access  Private/regularUser
export const createConversation = createOne(Conversation)

// @desc    Delete a specific conversation
// @route   DELETE /api/v1/connversations/:id
// @access  Private/regularUser
export const deleteConversation = deleteOne(Conversation)

// @desc    Get all conversations of a specific user
// @route   GET /api/v1/connversations/:userId
// @access  Private/regularUser
export const getAllConversationsOfUser = catchAsync(async (req, res, next) => {
  const doc = await Conversation.find({
    participants: { $in: [req.user._id] },
  })

  if (!doc) {
    return next(
      new AppError(
        `No Conversations found for user with id ${req.params.userId}`,
        404
      )
    )
  }

  res.status(200).json({
    status: 'success',
    data: doc,
  })
})
