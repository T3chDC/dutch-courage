import {
  View,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  BackHandler,
} from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
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
import {
  createMessage,
  resetCreateMessage,
  resetMessage,
} from '../features/message/messageSlice'
import { PlusIcon, ArrowUpIcon } from 'react-native-heroicons/solid'
import { BACKEND_URL } from '../config'
import Toast from 'react-native-toast-message'
import * as Progress from 'react-native-progress'
import socket from '../utils/socketInit'
import SwipeButton from 'rn-swipe-button'

const ConversationScreen = () => {
  // Navigation hook
  const navigation = useNavigation()
  const route = useRoute()
  // Route params from InboxScreen
  const { conversationId, sender} = route.params
  // Redux Dispatch hook
  const dispatch = useDispatch()
  // Scroll view ref
  const scrollViewRef = useRef(null)

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

  const {
    message,
    isCreateMessageLoading,
    isCreateMessageSuccess,
    isCreateMessageError,
    createMessageErrorMessage,
  } = useSelector((state) => state.message)

  //local State variables
  const [messageText, setMessageText] = useState('')
  const [conversationMessages, setConversationMessages] = useState([])
  const [newArrivedMessage, setNewArrivedMessage] = useState(null)

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

  // Show error message if there is any or populate the conversation messages
  useEffect(() => {
    if (isGetConversationByIdSuccess) {
      setConversationMessages(conversation.messages)
      dispatch(resetGetConversationById())
    } else if (isGetConversationByIdError) {
      Toast.show({
        type: 'error',

        text1: getConversationByIdErrorMessage,
        visibilityTime: 3000,
      })
      dispatch(resetGetConversationById())
    }
  }, [
    isGetConversationByIdSuccess,
    isGetConversationByIdError,
    getConversationByIdErrorMessage,
    dispatch,
  ])

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

  // Scroll to bottom of messages when keyboard is open
  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () =>
      scrollViewRef.current.scrollToEnd({ animated: true })
    )

    // cleanup function
    return () => {
      Keyboard.removeAllListeners('keyboardDidShow')
    }
  }, [])

  // Refetch conversation when new message is created
  useEffect(() => {
    if (isCreateMessageSuccess) {
      setConversationMessages([...conversationMessages, message])
      // Send message to socket
      socket.emit('sendMessage', {
        conversationId,
        senderId: userInfo._id,
        receiverId: sender._id,
        messageType: message.messageType,
        message: message.message,
        messageImageUrl: message.messageImageUrl,
      })
      dispatch(resetCreateMessage())
      setMessageText('')
    } else if (isCreateMessageError) {
      Toast.show({
        type: 'error',
        text1: createMessageErrorMessage,
        visibilityTime: 3000,
      })
      dispatch(resetCreateMessage())
    }
  }, [
    isCreateMessageSuccess,
    isCreateMessageError,
    createMessageErrorMessage,
    dispatch,
  ])

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

  // Function to create text message
  const createTextMessage = () => {
    if (messageText.trim() === '') {
      return
    }
    dispatch(
      createMessage({
        conversationId,
        sender: userInfo._id,
        messageType: 'text',
        message: messageText,
      })
    )
  }

  // Update conversation messages when new message is received
  useEffect(() => {
    socket.on('getMessage', (data) => {
      setNewArrivedMessage(data)
    })
  }, [conversationId, conversationMessages])

  useEffect(() => {
    if (newArrivedMessage) {
      if (newArrivedMessage.conversationId === conversationId) {
        setConversationMessages([...conversationMessages, newArrivedMessage])
      }
    }
  }, [newArrivedMessage])

  // Clear redux state on unmount
  useEffect(() => {
    return () => {
      dispatch(resetGetConversationById())
      dispatch(resetConversation())
      dispatch(resetUpdateConversationById())
      dispatch(resetCreateMessage())
      dispatch(resetMessage())
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

      {isGetConversationByIdLoading ? (
        <View className='flex-1 justify-center items-center mt-[15]'>
          <Text className='text-[#22A6B3] text-2xl font-bold mb-4'>
            Getting your messages ready...
          </Text>
          <Progress.CircleSnail
            color={['#22A6B3', '#22A6B3', '#22A6B3']}
            size={100}
            thickness={5}
            className='w-[100vw] flex-row justify-center items-center'
          />
        </View>
      ) : conversation?.messages?.length === 0 ? (
        <View className='mt-[100]'>
          <Text className='text-white text-base'>
            No messages found, Send a message to start conversation
          </Text>
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={'height'}
          className='flex-1 flex-col justify-end items-center mt-[100] w-80 h-[650] mb-6'
        >
          {/* Scrollable view to display the messages */}
          <ScrollView
            // className='flex flex-col justify-end items-center w-80'
            contentContainerStyle={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems: 'center',
              width: '100%',
            }}
            ref={scrollViewRef}
            onContentSizeChange={() =>
              scrollViewRef.current.scrollToEnd({ animated: true })
            }
          >
            {conversationMessages?.map((message) => (
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
        </KeyboardAvoidingView>
      )}

      {/* View to display the input field to send messages */}
      <View className=' w-full flex flex-row justify-center items-center'>
        <View className='flex flex-row justify-center items-center w-96 relative'>
          <TouchableOpacity className='flex flex-row justify-center items-center'>
            <PlusIcon size={30} color={'#FFFFFF'} />
          </TouchableOpacity>
          <TextInput
            className='flex-1 text-white text-base bg-[#000000] rounded-xl py-2 pl-4 pr-10 w-[200] text-left border border-[#22A6B3]'
            placeholder='Be Nice...'
            placeholderTextColor='#A1A5AC'
            value={messageText}
            onChangeText={(text) => {
              setMessageText(text)
              if (text.length > 280) {
                setMessageText(text.slice(0, 280))
              }
            }}
            multiline={true}
          />
          <TouchableOpacity
            className='flex flex-row justify-center items-center absolute right-2'
            onPress={createTextMessage}
          >
            <ArrowUpIcon size={30} color={'#FFFFFF'} />
          </TouchableOpacity>
        </View>
      </View>
      {/* View to display the length of text*/}
      <View className='flex flex-row justify-end items-center w-96'>
        <Text className='text-[#A1A5AC] text-xs'>{messageText.length}/280</Text>
      </View>
    </View>
  )
}

export default ConversationScreen
