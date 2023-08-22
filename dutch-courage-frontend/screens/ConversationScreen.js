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
  deleteConversationById,
  resetDeleteConversationById,
} from '../features/conversation/conversationSlice'
import {
  createMessage,
  resetCreateMessage,
  resetMessage,
} from '../features/message/messageSlice'
import { PlusIcon, PaperAirplaneIcon } from 'react-native-heroicons/solid'
import { BACKEND_URL } from '../config'
import Toast from 'react-native-toast-message'
import * as Progress from 'react-native-progress'
import socket from '../utils/socketInit'
import SelectFilesModal from '../components/SelectFilesModal'
import ConfirmSelectedFileModal from '../components/ConfirmSelectedFileModal'
import axios from 'axios'

const ConversationScreen = () => {
  // Navigation hook
  const navigation = useNavigation()
  const route = useRoute()
  // Route params from InboxScreen
  const { conversationId, sender } = route.params
  // Redux Dispatch hook
  const dispatch = useDispatch()
  // Scroll view ref
  const scrollViewRef = useRef(null)

  // Redux State variables
  const { userInfo } = useSelector((state) => state.auth)

  const { meUser } = useSelector((state) => state.user)

  const [isSelectFileModalVisible, setIsSelectFileModalVisible] =
    useState(false)
  const [confirmSelectedFileModalVisible, setConfirmSelectedFileModalVisible] =
    useState(false)

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
    isDeleteConversationByIdLoading,
    isDeleteConversationByIdSuccess,
    isDeleteConversationByIdError,
    deleteConversationByIdErrorMessage,
  } = useSelector((state) => state.conversation)

  const {
    message,
    isCreateMessageLoading,
    isCreateMessageSuccess,
    isCreateMessageError,
    createMessageErrorMessage,
  } = useSelector((state) => state.message)

  //local State variables
  const [selectedImage, setSelectedImage] = useState(null)
  const [messageText, setMessageText] = useState('')
  const [conversationMessages, setConversationMessages] = useState([])
  const [userMessageCount, setUserMessageCount] = useState(0)
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
      setUserMessageCount(conversation.participantsMessageCount[userInfo._id])
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
      navigation.navigate('UserInbox')
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
      setUserMessageCount(userMessageCount + 1)
      // Send message to socket
      socket.emit('sendMessage', {
        conversationId,
        senderId: userInfo._id,
        receiverId: sender._id,
        messageType: message.messageType,
        message: message.message,
        messageImageUrl: message.messageImageUrl,
        createdAt: message.createdAt,
      })
      dispatch(resetCreateMessage())
      setMessageText('')
    } else if (isCreateMessageError) {
      Toast.show({
        type: 'error',
        text1: createMessageErrorMessage,
        visibilityTime: 4000,
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

  // Function to upload image for message
  const messageImageUploadHandler = async () => {
    const formData = new FormData()
    formData.append('image', {
      uri: selectedImage,
      type: 'image/jpeg',
      name: 'image.jpg',
    })

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
      const res = await axios.post(
        BACKEND_URL + '/api/v1/upload',
        formData,
        config
      )
      return res.data
    } catch (error) {
      console.log(error)
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

  // Function to create image message
  const createImageMessage = async () => {
    if (!selectedImage) {
      return
    }
    const messageImageUrl = await messageImageUploadHandler()
    dispatch(
      createMessage({
        conversationId,
        sender: userInfo._id,
        messageType: 'image',
        messageImageUrl,
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

  // Function to accept text request
  const acceptTextRequestHandler = () => {
    dispatch(
      updateConversationById({
        conversationId,
        data: {
          acceptedBy: [...conversation.acceptedBy, userInfo._id],
        },
      })
    )
  }

  // Function to decline text request
  const declineTextRequestHandler = () => {
    dispatch(deleteConversationById(conversationId))
  }

  // If conversation is deleted navigate back to inbox screen
  useEffect(() => {
    if (isDeleteConversationByIdSuccess) {
      dispatch(resetDeleteConversationById())
      dispatch(getAllConversationsOfUser())
      Toast.show({
        type: 'success',
        text1: 'Conversation will not be continued with this user',
        visibilityTime: 4000,
      })
      navigation.navigate('UserInbox')
    } else if (isDeleteConversationByIdError) {
      Toast.show({
        type: 'error',
        text1: deleteConversationByIdErrorMessage,
        visibilityTime: 4000,
      })
      dispatch(resetDeleteConversationById())
    }
  }, [isDeleteConversationByIdSuccess, isDeleteConversationByIdError, dispatch])

  return (
    <View className='bg-black flex-1 justify-start items-center relative'>
      <TouchableOpacity
        className='absolute top-12 left-4 flex-row items-center'
        onPress={() => {
          dispatch(getAllConversationsOfUser())
          navigation.navigate('UserInbox')
        }}
      >
        <Text className='text-white text-base top-[-1]'>{'<'}</Text>
      </TouchableOpacity>

      <View className='flex flex-row absolute items-left left-8 top-11'>
        <View className='w-[60] justify-center items-center'>
          <View className='w-[40] h-[40] rounded-full bg-[#FCFCFE] justify-center items-center'>
            {/* <TouchableOpacity
              onPress={() => {
                navigation.navigate('OtherUserProfile', {
                  userId: sender?._id,
                })
              }}
            > */}
            <Image
              className='w-[40] h-[40] rounded-full'
              source={{
                uri: `${BACKEND_URL}/uploads/${sender?.imageUrl.slice(
                  sender?.imageUrl.lastIndexOf('/') + 1
                )}`,
              }}
            />
            {/* </TouchableOpacity> */}
          </View>
        </View>

        <View className='w-[160] justify-center items-left'>
          <Text className='text-white'>{sender?.userName}</Text>
        </View>

        <View className='w-[150] justify-center items-center'>
          <Text className='text-white text-xs'>
            {10 - userMessageCount}/10 messages left
          </Text>
        </View>
      </View>

      <View className='absolute'>
        <View className='mt-[95] flex-1 h-[1] w-[400] bg-[#22A6B3]'></View>
      </View>

      {isGetConversationByIdLoading ? (
        // <View className='flex-1 justify-center items-center mt-[15]'>
        //   <Text className='text-[#22A6B3] text-2xl font-bold mb-4'>
        //     Getting your messages ready...
        //   </Text>
        //   <Progress.CircleSnail
        //     color={['#22A6B3', '#22A6B3', '#22A6B3']}
        //     size={100}
        //     thickness={5}
        //     className='w-[100vw] flex-row justify-center items-center'
        //   />
        // </View>
        <></>
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
            {conversationMessages?.map((message, idx) => (
              <View
                key={idx}
                className='flex flex-col justify-center items-center'
              >
                {/* flex row to display the time of the message sent */}
                <View
                  className={
                    message.sender === userInfo._id
                      ? 'flex flex-row justify-end items-center w-80 mt-2'
                      : 'flex flex-row justify-start items-center w-80 mt-2'
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
                      {message.sender === userInfo._id &&
                      message.message.startsWith('You have a notification from')
                        ? 'You sent a wave to this user'
                        : message.message}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>
        </KeyboardAvoidingView>
      )}

      {/* View to display the input field to send messages or accept or disconnect to the text request */}
      {
        // Check if logged in user is in the acceptedBy array of converstion
        !conversation?.acceptedBy?.includes(userInfo._id) ? (
          <View className='absolute bottom-5 flex flex-row justify-center items-center w-full'>
            <View className='flex flex-row justify-evenly items-center w-[380]'>
              <TouchableOpacity
                className='flex flex-row justify-center items-center w-[150] h-[50] rounded-xl bg-[#22A6B3]'
                onPress={() => {
                  acceptTextRequestHandler()
                }}
              >
                <Text className='text-white text-base font-semibold'>
                  Connect
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className='flex flex-row justify-center items-center w-[150] h-[50] rounded-xl bg-[#ffffff]'
                onPress={() => {
                  declineTextRequestHandler()
                }}
              >
                <Text className='text-[#22A6B3] text-base font-semibold'>
                  Disconnect
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : conversation?.acceptedBy?.includes(userInfo._id) &&
          conversation?.acceptedBy?.length === 1 ? (
          <View className='absolute bottom-10 flex flex-row justify-center items-center w-full'>
            <View className='flex flex-row justify-center items-center relative w-[380]'>
              {/* Show that the other user has not accepted the conversation request */}
              <Text className='text-white text-base'>
                Please wait for the other user to accept the request...
              </Text>
            </View>
          </View>
        ) : (
          <View className='w-full flex flex-row justify-center items-center'>
            <View className='flex flex-row justify-center items-center relative w-[380]'>
              <TouchableOpacity
                className='flex flex-row justify-center items-center'
                onPress={() => {
                  setIsSelectFileModalVisible(true)
                }}
              >
                <PlusIcon size={30} color={'#FFFFFF'} />
              </TouchableOpacity>

              {/* Files Select Modal */}
              <SelectFilesModal
                isSelectFileModalVisible={isSelectFileModalVisible}
                setIsSelectFileModalVisible={setIsSelectFileModalVisible}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                isConfirmSelectedFileModalVisible={
                  confirmSelectedFileModalVisible
                }
                setIsConfirmSelectedFileModalVisible={
                  setConfirmSelectedFileModalVisible
                }
              />

              {/* Confirm Selected File Sending Modal */}
              <ConfirmSelectedFileModal
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                isConfirmSelectedFileModalVisible={
                  confirmSelectedFileModalVisible
                }
                setIsConfirmSelectedFileModalVisible={
                  setConfirmSelectedFileModalVisible
                }
                createImageMessage={createImageMessage}
              />

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
                <PaperAirplaneIcon size={30} color={'#FFFFFF'} />
              </TouchableOpacity>
            </View>
          </View>
        )
      }

      {/* View to display the length of text*/}
      {conversation?.acceptedBy?.includes(userInfo._id) && (
        <View className='flex flex-row justify-end items-center w-[370]'>
          <Text className='text-[#A1A5AC] text-xs'>
            {messageText.length}/280
          </Text>
        </View>
      )}
    </View>
  )
}

export default ConversationScreen
