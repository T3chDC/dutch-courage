import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  BackHandler,
} from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { TrashIcon } from 'react-native-heroicons/outline'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import {
  getAllConversationsOfUser,
  resetConversations,
  resetGetAllConversationsOfUser,
  deleteConversationById,
  resetDeleteConversationById,
  deleteConversations,
  resetDeleteConversations,
} from '../features/conversation/conversationSlice'
import Conversation from '../components/Conversation'
import * as Progress from 'react-native-progress'
import Toast from 'react-native-toast-message'
import socket from '../utils/socketInit'
import SwipeButton from 'rn-swipe-button'

const InboxScreen = () => {
  // Navigation hook
  const navigation = useNavigation()
  // Redux Dispatch hook
  const dispatch = useDispatch()

  // Redux State variables
  const { userInfo } = useSelector((state) => state.auth)

  const {
    conversations,
    isGetAllConversationsOfUserLoading,
    isGetAllConversationsOfUserSuccess,
    isGetAllConversationsOfUserError,
    getAllConversationsOfUserErrorMessage,
    isDeleteConversationByIdError,
    isDeleteConversationByIdSuccess,
    isDeleteConversationByIdLoading,
    deleteConversationByIdErrorMessage,
    isDeleteConversationsError,
    isDeleteConversationsSuccess,
    isDeleteConversationsLoading,
    deleteConversationsErrorMessage,
  } = useSelector((state) => state.conversation)

  // local state variables
  const [selectedConversations, setSelectedConversations] = useState([])
  const [isDeleteMode, setIsDeleteMode] = useState(false)

  // Check if user is logged in
  useEffect(() => {
    if (!userInfo) {
      navigation.navigate('Login')
    }
  }, [userInfo, navigation])

  // Send userId to socket server on connection
  useEffect(() => {
    socket.emit('addUser', userInfo._id)
    socket.on('getUsers', (users) => {
      console.log(users)
    })
  }, [userInfo])

  // Get all conversations of user when component mounts
  useEffect(() => {
    dispatch(getAllConversationsOfUser())
  }, [dispatch])

  // Handle get all conversations of user error
  useEffect(() => {
    if (isGetAllConversationsOfUserError) {
      Toast.show({
        type: 'error',
        text1: getAllConversationsOfUserErrorMessage,
        visibilityTime: 3000,
      })
      dispatch(resetGetAllConversationsOfUser())
    }
  }, [isGetAllConversationsOfUserError, getAllConversationsOfUserErrorMessage])

  // function to handle back press of hardware
  useEffect(() => {
    const backAction = () => {
      if (isDeleteMode) {
        setIsDeleteMode(false)
        setSelectedConversations([])
        return true
      } else {
        navigation.goBack()
        return true
      }
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    )

    return () => backHandler.remove()
  }, [isDeleteMode, navigation, selectedConversations])

  // Handle delete conversations which are selected
  useEffect(() => {
    if (isDeleteConversationsSuccess) {
      Toast.show({
        type: 'success',
        text1: 'Conversations deleted successfully',
        visibilityTime: 3000,
      })
      dispatch(resetDeleteConversations())
      dispatch(getAllConversationsOfUser())
      setIsDeleteMode(false)
      setSelectedConversations([])
    } else if (isDeleteConversationsError) {
      Toast.show({
        type: 'error',
        text1: deleteConversationsErrorMessage,
        visibilityTime: 3000,
      })
      dispatch(resetDeleteConversations())
    }
  }, [isDeleteConversationsSuccess, isDeleteConversationsError, dispatch])

  // function to delete selected conversations
  const deleteSelectedConversations = () => {
    Alert.alert(
      'Delete Conversations',
      'Are you sure you want to delete the selected conversations?',
      [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            dispatch(
              deleteConversations({
                conversationIds: selectedConversations,
              })
            )
          },
        },
      ]
    )
  }

  // Update conversation list when a new conversation message is received
  useEffect(() => {
    socket.on('getMessage', (data) => {
      dispatch(getAllConversationsOfUser())
    })
  }, [dispatch])

  // clear redux state on unmount
  useEffect(() => {
    return () => {
      dispatch(resetConversations())
      dispatch(resetGetAllConversationsOfUser())
    }
  }, [dispatch])

  return (
    <View className='bg-black flex-1 justify-start items-center relative'>
      <TouchableOpacity
        className='absolute top-10 left-4 flex-row items-center'
        onPress={() => {
          navigation.goBack()
        }}
      >
        {/* <ChevronLeftIcon size={20} color='white' /> */}
        <Text className='text-white text-base top-[-1]'>{'< Back'}</Text>
      </TouchableOpacity>

      {/* Messages Section /> */}
      <View className='flex-row items-center justify-evenly relative'>
        {isDeleteMode && selectedConversations.length > 0 ? (
          <View className='flex-row items-center justify-evenly relative'>
            <View className='flex-row items-center justify-center absolute top-6 left-10'>
              <Text className='text-[#22A6B3] text-base'>
                {selectedConversations.length}
              </Text>
            </View>
            <TouchableOpacity
              className='flex-row items-center justify-center absolute top-6 left-[350] w-6 h-6'
              onPress={() => deleteSelectedConversations()}
            >
              <TrashIcon size={20} color='#22A6B3' />
            </TouchableOpacity>
          </View>
        ) : (
          <Text className='text-[#808080] text-base  absolute top-20 left-10'>
            Messages
          </Text>
        )}
        <View className='mt-[110] flex-1 h-[0.8] w-60 bg-[#22A6B3]'></View>
      </View>

      {/* show loader if data is being fetched, 
      else if there is no message, show there is no message,
      otherwise show the messages */}
      {isGetAllConversationsOfUserLoading ? (
        <View className='flex-1 justify-center items-center mt-[15]'>
          <Text className='text-[#22A6B3] text-2xl font-bold mb-4'>
            Getting your conversations ready...
          </Text>
          <Progress.CircleSnail
            color={['#22A6B3', '#22A6B3', '#22A6B3']}
            size={100}
            thickness={5}
            className='w-[100vw] flex-row justify-center items-center'
          />
        </View>
      ) : conversations.length === 0 ? (
        <View className='mt-[100]'>
          <Text className='text-white text-base'>No messages to show</Text>
        </View>
      ) : (
        <>
          {conversations?.map((conversation) =>
            conversation.deletedBy.includes(userInfo._id) ? null : (
              <Conversation
                key={conversation._id}
                conversation={conversation}
                loggedInUser={userInfo}
                selectedConversations={selectedConversations}
                setSelectedConversations={setSelectedConversations}
                isDeleteMode={isDeleteMode}
                setIsDeleteMode={setIsDeleteMode}
                
              />
            )
          )}
        </>
      )}
    </View>
  )
}

export default InboxScreen
