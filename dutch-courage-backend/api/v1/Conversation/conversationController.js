/* This file contains the logic for handling requests and communicating with the conversations data model*/

import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'
import Conversation from './conversationModel.js'
import Message from '../Message/messageModel.js'

import { createOne, updateOne } from '../common/handlerFactory.js' //import generic handler

// @desc    Create conversation
// @route   POST /api/v1/connversations
// @access  Private/regularUser
export const createConversation = createOne(Conversation)

// @desc    Delete a specific conversation
// @route   DELETE /api/v1/connversations/:id
// @access  Private/regularUser
export const deleteConversation = catchAsync(async (req, res, next) => {
  //update the conversation to add the user to the deletedBy field
  const conversation = await Conversation.findByIdAndUpdate(
    req.params.id,
    {
      $addToSet: { deletedBy: req.user._id },
    },
    { new: true }
  )

  if (!conversation) {
    return next(
      new AppError(
        `No Conversation found with id ${req.params.id} for user with id ${req.user._id}`,
        404
      )
    )
  }

  //if the conversation has been deleted by both users, delete the conversation
  if (conversation.deletedBy.length === 2) {
    //delete all messages in the conversation
    await Message.deleteMany({ conversationId: req.params.id })
    await Conversation.findByIdAndDelete(req.params.id)
  }

  res.status(200).json({
    status: 'success',
    data: req.params.id,
  })
})

//@desc    Delete multiple conversations
//@route   DELETE /api/v1/connversations/deleteMany
//@access  Private/regularUser
export const deleteManyConversations = catchAsync(async (req, res, next) => {
  //update the conversation to add the user to the deletedBy field
  const conversations = await Conversation.updateMany(
    { _id: { $in: req.body.conversationIds } },
    {
      $addToSet: { deletedBy: req.user._id },
    },
    { new: true }
  )

  if (!conversations) {
    return next(
      new AppError(
        `No Conversations found with ids ${req.body.conversationIds} for user with id ${req.user._id}`,
        404
      )
    )
  }

  //if the conversation has been deleted by both users, delete the conversation and all messages in it
  const deletedConversations = await Conversation.find({
    _id: { $in: req.body.conversationIds },
    deletedBy: { $size: 2 },
  })

  if (deletedConversations.length > 0) {
    //delete all messages in the conversation
    await Message.deleteMany({
      conversationId: { $in: req.body.conversationIds },
    })
    await Conversation.deleteMany({
      _id: { $in: req.body.conversationIds },
    })
  }

  res.status(200).json({
    status: 'success',
    data: req.body.conversationIds,
  })
})

// @desc    Update a specific conversation
// @route   PATCH /api/v1/connversations/:id
// @access  Private/regularUser
export const updateConversation = updateOne(Conversation)

// @desc    Get all conversations of logged in user
// @route   GET /api/v1/connversations/getMyConversations
// @access  Private/regularUser
export const getAllConversationsOfUser = catchAsync(async (req, res, next) => {
  const conversations = await Conversation.find({
    participants: { $in: [req.user._id] },
  }).sort({ updatedAt: -1 })

  if (!conversations) {
    return next(
      new AppError(
        `No Conversations found for user with id ${req.params.userId}`,
        404
      )
    )
  }

  res.status(200).json({
    status: 'success',
    data: conversations,
  })
})

// @desc    Get a specific conversation by id with all messages
// @route   GET /api/v1/connversations/:id
// @access  Private/regularUser
export const getConversation = catchAsync(async (req, res, next) => {
  const conversation = await Conversation.findById(req.params.id).populate(
    'messages',
    'sender messageType message messageImageUrl createdAt'
  )

  if (!conversation) {
    return next(
      new AppError(
        `No Conversation found with id ${req.params.id} for user with id ${req.user._id}`,
        404
      )
    )
  }

  res.status(200).json({
    status: 'success',
    data: conversation,
  })
})
