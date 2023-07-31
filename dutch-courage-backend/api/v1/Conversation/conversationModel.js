/* This file contains the data modelling and data tier fuinctionalities for conversations */

import mongoose from 'mongoose' //import mongoose

//create a conversation schema
const conversationSchema = new mongoose.Schema(
  {
    participants: {
      type: [mongoose.Schema.Types.ObjectId],
      required: [
        true,
        'there must be at least one participant in a conversation',
      ],
      validate: {
        validator: function (val) {
          return val.length > 0
        },
        message: 'there must be at least one participant in a conversation',
      },
      ref: 'User',
    },

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
      validate: {
        validator: function (val) {
          return val === null || val !== undefined
        },
        message: 'last message must be a valid message id',
      },
    },

    unreadMessageCount: {
      type: Number,
      default: 0,
    },

    participantsMessageCount: {
      type: Map,
      of: Number,
      default: {},
    },

    participantsLastMessageTime: {
      type: Map,
      of: Date,
      default: {},
    },

    acceptedBy: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      ref: 'User',
      validate: {
        validator: function (val) {
          return val.length <= 2
        },
        message: 'there can be at most two acceptedBy users',
      },
    },

    deletedBy: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      ref: 'User',

      validate: {
        validator: function (val) {
          return val.length <= 2
        },
        message: 'there can be at most two deletedBy users',
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Before creating a conversation, assign default values to the participantsMessageCount and participantsLastMessageTime fields
conversationSchema.pre('save', function (next) {
  if (this.isNew) {
    this.participants.forEach((participant) => {
      this.participantsMessageCount.set(participant, 0)
      this.participantsLastMessageTime.set(participant, null)
    })
  }
  next()
})

//Before finding a conversation, populate the participants field with the user data
conversationSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'participants',
    select: 'userName imageUrl',
  }).populate({
    path: 'lastMessage',
    select: 'messageType message messageImageUrl createdAt',
  })
  next()
})

//create a virtual field for the messages in a conversation
conversationSchema.virtual('messages', {
  ref: 'Message',
  foreignField: 'conversationId',
  localField: '_id',
})

//create a conversation model
const Conversation = mongoose.model('Conversation', conversationSchema)

export default Conversation
