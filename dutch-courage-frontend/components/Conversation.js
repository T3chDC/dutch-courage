import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { CheckIcon } from 'react-native-heroicons/solid'
import { BACKEND_URL } from '../config'
import { useNavigation } from '@react-navigation/native'

const Conversation = ({
  conversation,
  loggedInUser,
  selectedConversations,
  setSelectedConversations,
  isDeleteMode,
  setIsDeleteMode,
}) => {
  // Navigation hook
  const navigation = useNavigation()

  // sender is the other user
  const sender = conversation.participants.find(
    (participant) => participant._id !== loggedInUser._id
  )

  //state variable to check if this conversation is selected
  const [isSelected, setIsSelected] = useState(false)

  // if isDeleteMode is updated to false then set isSelected to false
  useEffect(() => {
    if (!isDeleteMode) {
      setIsSelected(false)
    }
  }, [isDeleteMode])
  

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

  const shortPressHandler = () => {
    if (isDeleteMode) {
      setIsSelected(!isSelected)
      if (!isSelected) {
        setSelectedConversations((prev) => [...prev, conversation._id])
      } else {
        setSelectedConversations((prev) =>
          prev.filter((id) => id !== conversation._id)
        )
        if (selectedConversations.length === 1) {
          setIsDeleteMode(false)
        }
      }
    } else {
      navigation.goBack()
      // navigation.navigate('Chat', {
      //   conversationId: conversation._id,
      //   sender,
      // })
    }
  }

  const longPressHandler = () => {
    setIsDeleteMode(true)
    setIsSelected(!isSelected)
    if (!isSelected) {
      setSelectedConversations((prev) => [...prev, conversation._id])
    } else {
      setSelectedConversations((prev) =>
        prev.filter((id) => id !== conversation._id)
      )
      if (selectedConversations.length === 1) {
        setIsDeleteMode(false)
      }
    }
  }

  return (
    <TouchableOpacity
      onPress={shortPressHandler}
      onLongPress={longPressHandler}
    >
      <View className='mt-[15] flex flex-row'>
        <View className='w-[60] flex-col'>
          <View
            className={
              isSelected
                ? 'w-[42] h-[42] rounded-full bg-[#FF0000] justify-center items-center'
                : 'w-[42] h-[42] rounded-full bg-[#FCFCFE] justify-center items-center'
            }
          >
            {isSelected ? (
              <View className='justify-center items-center'>
                <CheckIcon size={20} color='#FCFCFE' />
              </View>
            ) : (
              <Image
                source={{
                  uri: `${BACKEND_URL}/uploads/${sender.imageUrl.slice(
                    sender.imageUrl.lastIndexOf('/') + 1
                  )}`,
                }}
                className='w-[42] h-[42] rounded-full'
                resizeMode='cover'
              />
            )}
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
    </TouchableOpacity>
  )
}

export default Conversation
