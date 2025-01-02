/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require('firebase-functions/v2/https')
const logger = require('firebase-functions/logger')

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()

const firestore = admin.firestore()

// Function to update conversations
exports.updateMessageCount = functions.pubsub
  .schedule('every 1 minutes')
  .onRun(async (context) => {
    console.log('Scheduled task running...')
    const conversationsRef = firestore.collection('conversations')

    try {
      // Fetch all conversations
      const snapshot = await conversationsRef.get()
      const updates = []

      snapshot.forEach((doc) => {
        const conversation = doc.data()
        const participantsMessageCount =
          conversation.participantsMessageCount || {}
        const participantsLastMessageTime =
          conversation.participantsLastMessageTime || {}

        Object.keys(participantsLastMessageTime).forEach((participantId) => {
          const lastMessageTime = participantsLastMessageTime[participantId]
            ? participantsLastMessageTime[participantId].toDate()
            : null
          const messageCount = participantsMessageCount[participantId] || 0

          if (lastMessageTime) {
            const timeDifference = (Date.now() - lastMessageTime) / 1000 / 60
            if (timeDifference >= 45 && messageCount >= 10) {
              // Reset the message count for this participant
              participantsMessageCount[participantId] = 0
            }
          }
        })

        // Prepare the update
        updates.push(
          doc.ref.update({
            participantsMessageCount,
          })
        )
      })

      // Execute all updates
      await Promise.all(updates)
      console.log('Conversation message counts updated.')
    } catch (error) {
      console.error('Error updating message counts:', error)
    }

    return null
  })
