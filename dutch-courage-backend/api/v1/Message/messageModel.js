/* This file contains the data modelling and data tier fuinctionalities for messages */

import mongoose from 'mongoose' //import mongoose

//create a message schema

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'a message must belong to a conversation'],
      ref: 'Conversation',
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'a message must have a sender'],
      ref: 'User',
    },

    messageType: {
      type: String,
      enum: ['text', 'image'],
      default: 'text',
    },

    message: {
      type: String,
      required: [
        function () {
          return this.messageType === 'text'
        },
        ,
        'a message must have a message body',
      ],
    },

    messageImageUrl: {
      type: String,
      required: [
        function () {
          return this.messageType === 'image'
        },
        ,
        'a message must have an image url',
      ],
    },
  },
  {
    timestamps: true,
  }
)

// Create a message model

const Message = mongoose.model('Message', messageSchema)

export default Message
