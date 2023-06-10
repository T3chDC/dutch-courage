import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  BackHandler,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import {
  getConversationById,
  resetGetConversationById,
  getAllConversationsOfUser,
  resetConversation,
  updateConversationById,
  resetUpdateConversationById,
} from '../features/conversation/conversationSlice'
import { BACKEND_URL } from '../config'
import Toast from 'react-native-toast-message'
import SwipeButton from 'rn-swipe-button'

const ConversationScreen = () => {
  // Navigation hook
  const navigation = useNavigation()
  const route = useRoute()
  // Route params from InboxScreen
  const { conversationId, sender } = route.params
  // Redux Dispatch hook
  const dispatch = useDispatch()

  // Redux State variables
  const { userInfo } = useSelector((state) => state.auth)

  const {
    conversation,
    isGetConversationByIdLoading,
    isGetConversationByIdSuccess,
    isGetConversationByIdError,
    getConversationByIdErrorMessage,
    isUpdateConversationByIdLoading,
    isUpdateConversationByIdSuccess,
    isUpdateConversationByIdError,
    updateConversationByIdErrorMessage,
  } = useSelector((state) => state.conversation)

  // Check if user is logged in
  useEffect(() => {
    if (!userInfo) {
      navigation.navigate('Login')
    }
  }, [userInfo, navigation])

  // Get conversation by id
  useEffect(() => {
    if (conversationId) {
      dispatch(getConversationById(conversationId))
    }
  }, [conversationId, dispatch])

  // mark conversation as read
  useEffect(() => {
    if (
      conversationId &&
      isGetConversationByIdSuccess &&
      conversation.unreadMessageCount > 0
    ) {
      dispatch(
        updateConversationById({
          conversationId,
          data: {
            unreadMessageCount: 0,
          },
        })
      )
    }
  }, [conversationId, conversation, isGetConversationByIdSuccess, dispatch])

  // if conversation is updated successfully fetch the updated conversation again
  useEffect(() => {
    if (isUpdateConversationByIdSuccess) {
      dispatch(getConversationById(conversationId))
      dispatch(resetUpdateConversationById())
    }
  }, [isUpdateConversationByIdSuccess, dispatch])

  // Show error message if there is any
  useEffect(() => {
    if (isGetConversationByIdError) {
      Toast.show({
        type: 'error',

        text1: getConversationByIdErrorMessage,
        visibilityTime: 3000,
      })
      dispatch(resetGetConversationById())
    }
  }, [isGetConversationByIdError, getConversationByIdErrorMessage, dispatch])

  // Functionality when user is trying togo back to profile screen
  useEffect(() => {
    const backAction = () => {
      dispatch(getAllConversationsOfUser())
      navigation.goBack()
      return true
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    )

    return () => backHandler.remove()
  }, [navigation])

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

  // Clear redux state on unmount
  useEffect(() => {
    return () => {
      dispatch(resetGetConversationById())
      dispatch(resetConversation())
      dispatch(resetUpdateConversationById())
    }
  }, [dispatch])

  return (
    <View className='bg-black flex-1 justify-start items-center relative'>
      <TouchableOpacity
        className='absolute top-12 left-4 flex-row items-center'
        onPress={() => {
          dispatch(getAllConversationsOfUser())
          navigation.goBack()
        }}
      >
        <Text className='text-white text-base top-[-1]'>{'<'}</Text>
      </TouchableOpacity>

      <View className='flex flex-row absolute items-left left-8 top-11'>
        <View className='w-[60] justify-center items-center'>
          <View className='w-[40] h-[40] rounded-full bg-[#FCFCFE] justify-center items-center'>
            <Image
              className='w-[40] h-[40] rounded-full'
              source={{
                uri: `${BACKEND_URL}/uploads/${sender?.imageUrl.slice(
                  sender?.imageUrl.lastIndexOf('/') + 1
                )}`,
              }}
            />
          </View>
        </View>

        <View className='w-[220] justify-center items-left'>
          <Text className='text-white'>{sender?.userName}</Text>
        </View>
      </View>

      <View className='absolute'>
        <View className='mt-[95] flex-1 h-[1] w-[400] bg-[#22A6B3]'></View>
      </View>

      {/* Scrollable view to display the messages */}
      <View
        className='flex flex-col justify-end items-center mt-[100] w-80' 
      >
        <ScrollView
          // className='flex flex-col justify-end items-center w-80'
          contentContainerStyle={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {conversation?.messages?.map((message) => (
            <View
              key={message._id}
              className='flex flex-col justify-center items-center w-80'
            > 
              {/* flex row to display the time of the message sent */}
              <View
                className={
                  message.sender === userInfo._id
                    ? 'flex flex-row justify-end items-center w-80'
                    : 'flex flex-row justify-start items-center w-80'
                }
              >
                <Text className='text-[#AFD0AE] text-xs'>
                  {formatDate(message.createdAt)}
                </Text>
              </View>

              {/* flex row to display the message sent */}
              <View
                className={
                  message.sender === userInfo._id
                    ? 'flex flex-row justify-end items-center w-80'
                    : 'flex flex-row justify-start items-center w-80'
                }
              >
                {/* Check if the message is an image */}
                {message.messageType === 'image' ? (
                  <View
                    className={
                      message.sender === userInfo._id
                        ? 'flex flex-row justify-end items-center w-80'
                        : 'flex flex-row justify-start items-center w-80'
                    }
                  >
                    <Image
                      className='w-[200] h-[200] rounded-xl'
                      source={{
                        uri: `${BACKEND_URL}/uploads/${message.messageImageUrl.slice(
                          message.messageImageUrl.lastIndexOf('/') + 1
                        )}`,
                      }}
                    />
                  </View>
                ) : (
                  <Text
                    className={
                      message.sender === userInfo._id
                        ? 'text-white text-base bg-[#22A6B3] rounded-xl px-4 py-2 w-[200] text-left'
                        : 'text-white text-base bg-[#666666] rounded-xl px-4 py-2 w-[200] text-left'
                    }
                  >
                    {message.message}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  )
}

export default ConversationScreen
