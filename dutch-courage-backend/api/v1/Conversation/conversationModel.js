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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

//Before finding a conversation, populate the participants field with the user data
conversationSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'participants',
    select: 'userName imageUrl',
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
