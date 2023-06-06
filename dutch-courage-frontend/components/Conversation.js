import { View, Text, Image } from 'react-native'
import React from 'react'

const Conversation = ({ conversation, loggedInUser }) => {
  // sender is the other user
  const sender = conversation.participants.find(
    (participant) => participant._id !== loggedInUser._id
  )

  //functin to format date and time
  const formatDate = (datetime) => {
    const now = new Date()

    const date = new Date(datetime)

    // Calculate the time difference in milliseconds
    const timeDiff = now - date
    const secondsDiff = Math.floor(timeDiff / 1000)
    const minutesDiff = Math.floor(secondsDiff / 60)
    const hoursDiff = Math.floor(minutesDiff / 60)
    const daysDiff = Math.floor(hoursDiff / 24)
    const yearsDiff = now.getFullYear() - date.getFullYear()

    // if (secondsDiff < 60) {
    //   return `${secondsDiff} seconds`
    // } else if (minutesDiff < 60) {
    //   return `${minutesDiff} minutes`
    // } else
    if (hoursDiff < 24) {
      return `${date.getHours()}:${date.getMinutes()}`
    } else if (daysDiff === 1) {
      return 'Yesterday'
    } else if (daysDiff < 7) {
      const days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ]
      return days[date.getDay()]
    } else if (now.getFullYear() === date.getFullYear()) {
      const formattedDate = `${date.getDate()}/${
        date.getMonth() + 1
      }/${date.getFullYear()}`
      return formattedDate
    } else {
      return `${yearsDiff} years ago`
    }
  }

  return (
    <View className='mt-[15] flex flex-row'>
      <View className='w-[60] flex-col'>
        <View className='w-[42] h-[40] rounded-full bg-[#FCFCFE] justify-center items-center'>
          <Image
            source={{ uri: sender.imageUrl }}
            className='w-10 h-10 rounded-full'
            resizeMode='cover'
          />
        </View>
      </View>
      <View>
        <View className='flex flex-row'>
          <View className='w-[220] flex flex-col'>
            <View>
              <Text className='text-white font-bold'>{sender.userName}</Text>
            </View>
            <View className='mt-1'>
              <Text className='text-white text-xs'>
                {conversation.lastMessage.messageType === 'text'
                  ? conversation.lastMessage.message
                  : conversation.lastMessage.messageType === 'image'
                  ? 'Image'
                  : 'New Message'}
              </Text>
            </View>
          </View>

          <View className='w-[70] flex flex-col'>
            <Text
              className={
                conversation.unreadMessageCount > 0
                  ? `text-xs text-right text-[#22A6B3]`
                  : `text-xs text-right text-[#A1A5AC]`
              }
            >
              {formatDate(conversation.lastMessage.createdAt)}
            </Text>
          </View>
        </View>
        <View className='flex flex-row mt-3 h-[1] w-[300] bg-[#22A6B3]'></View>
      </View>
    </View>
  )
}

export default Conversation
