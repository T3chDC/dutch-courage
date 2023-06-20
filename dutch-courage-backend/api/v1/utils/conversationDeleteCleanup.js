// This file will delete the associated images of messages when a conversation is deleted

import * as fs from 'fs'
import Message from '../Message/messageModel.js'

const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) throw err
  })
}

const conversationDeleteCleanup = async (conversationId) => {
  const messages = await Message.find({ conversationId: conversationId })

  messages.forEach((message) => {
    if (message.messageType === 'image') {
      const messageImageUrl = message.messageImageUrl
      const extractedFileName = messageImageUrl.slice(
        messageImageUrl.lastIndexOf('/') + 1
      )
      deleteFile(`./uploads/${extractedFileName}`)
    }
  })
}

export default conversationDeleteCleanup
