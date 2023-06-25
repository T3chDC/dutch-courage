/* This file contains the logic for handling requests and communicating with the messages data model*/

import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'
import Message from './messageModel.js'
import Conversation from '../Conversation/conversationModel.js'

import { deleteOne } from '../common/handlerFactory.js' //import generic handler

// @desc    Create message
// @route   POST /api/v1/messages
// @access  Private/regularUser
export const createMessage = catchAsync(async (req, res, next) => {
  // fetch the conversation
  const conversation = await Conversation.findById({
    _id: req.body.conversationId,
  })

  if (!conversation) {
    return next(
      new AppError(
        'Could not find conversation for which the message will be created',
        404
      )
    )
  } else {
    // Check if the number of messages sent by the sender in the conversation is less than 10 and if not
    // then check if the last message sent by the sender was sent more than 45 minute ago
    const messageCount = conversation.participantsMessageCount.get(
      req.body.sender
    )
    const lastMessageTime = conversation.participantsLastMessageTime.get(
      req.body.sender
    )

    if (lastMessageTime) {
      const timeDifference = (new Date() - lastMessageTime) / 1000 / 60
      if (timeDifference < 45 && messageCount >= 10) {
        return next(
          new AppError(
            'You have reached the maximum number of messages you can send in a conversation. Please wait for 45 minutes before sending another message',
            429
          )
        )
      }
      // } else if (timeDifference >= 45) {
      //   // if the last message was sent more than 45 minutes ago, reset the message count to 0
      //   conversation.participantsMessageCount.set(req.body.sender, 0)
      //   await conversation.save()
      // }
    }
  }

  //Create message
  const newMessage = await Message.create(req.body)

  if (!newMessage) {
    return next(new AppError('Could not create message', 429))
  }

  //Update the conversation with the new message as the lastMessage and increase the unreadMessageCount by 1
  const updatedConversation = await Conversation.findByIdAndUpdate(
    req.body.conversationId,
    {
      lastMessage: newMessage._id,
      $inc: { unreadMessageCount: 1 },
      $set: {
        [`participantsMessageCount.${req.body.sender}`]:
          conversation.participantsMessageCount.get(req.body.sender) + 1,
        [`participantsLastMessageTime.${req.body.sender}`]: new Date(),
      },
    },
    { new: true }
  )

  if (!updatedConversation) {
    return next(new AppError('Could not update conversation', 429))
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
