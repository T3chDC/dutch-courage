import {
  View,
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
  resetConversation,
} from '../features/conversation/conversationSlice'
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

  // Functionality when user is trying togo back to profile screen
  const backAction = () => {
    navigation.goBack()
  }

  // Clear redux state on unmount
  useEffect(() => {
    return () => {
      dispatch(resetGetConversationById())
      dispatch(resetConversation())
    }
  }, [dispatch])

  return (
    <View className='bg-black flex-1 justify-start items-center relative'>
      <TouchableOpacity
        className='absolute top-12 left-4 flex-row items-center'
        onPress={() => backAction()}
      >
        <Text className='text-white text-base top-[-1]'>{'<'}</Text>
      </TouchableOpacity>

      <View className='flex flex-row absolute items-left left-8 top-10'>
        <View className='w-[60] justify-center items-center'>
          <View className='w-[42] h-[42] rounded-full bg-[#FCFCFE] '>
            {/* Image will appear here */}
          </View>
        </View>

        <View className='w-[220] justify-center items-left'>
          <Text className='text-white'>User Name</Text>
        </View>
      </View>

      <View className='absolute'>
        <View className='mt-[95] flex-1 h-[1] w-[400] bg-[#22A6B3]'></View>
      </View>

      {/* Conversation */}
      <View className='flex flex-col items-center justify-center p-10'>
        <View className='flex flex-col flex-grow w-full'>
          <View className='flex flex-col flex-grow p-4 overflow-auto'>
            <View className='flex w-full mt-3 space-x-3 max-w-xs'>
              <View className='flex-shrink-0 h-10'></View>
              <View className='bg-gray-300 p-4 rounded-lg rounded-bl-0'>
                <Text className='text-sm'>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Quibusdam, quos?
                </Text>
              </View>

              <View className='text-xs'>
                <Text className='text-gray-500'>2 min ago</Text>
              </View>
            </View>
          </View>

          <View className='flex w-full mt-2 ml-auto justify-end'>
            <View className='bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg'>
              <Text className='text-sm'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </Text>
            </View>

            <View className='text-xs leading-none'>
              <Text className='text-gray-500'>1 min ago</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default ConversationScreen
