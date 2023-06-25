// This file will contain the function to periodically update the message count
import Conversation from '../Conversation/conversationModel.js'

// update a conversation's message count if the last message was sent more than 45 minutes ago and the message count is greater than 10
const updateMessageCount = async () => {
  const conversations = await Conversation.find()
  conversations.forEach(async (conversation) => {
    conversation.participants.forEach(async (participant) => {
      const messageCount = conversation.participantsMessageCount.get(
        participant._id
      )
      const lastMessageTime = conversation.participantsLastMessageTime.get(
        participant._id
      )
      if (lastMessageTime) {
        const timeDifference = (new Date() - lastMessageTime) / 1000 / 60
        if (timeDifference >= 45 && messageCount >= 10) {
          conversation.participantsMessageCount.set(participant._id, 0)
          await conversation.save()
        }
      }
    })
  })
}

export default updateMessageCount
