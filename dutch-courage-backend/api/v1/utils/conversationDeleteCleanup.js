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
      const extractedFileName = message.messageImageUrl.slice(
        imageUrl.lastIndexOf('/') + 1
      )
      deleteFile(`./uploads/${extractedFileName}`)
    }
  })
}

export default conversationDeleteCleanup
