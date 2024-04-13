import { View, Text, TouchableOpacity } from 'react-native'
import { UserIcon, ChatBubbleLeftRightIcon } from 'react-native-heroicons/solid'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import socket from '../utils/socketInit'
import {
  getAllConversationsOfUser,
  resetGetAllConversationsOfUser,
} from '../features/conversation/conversationSlice'
import { useNavigation } from '@react-navigation/native'

const BottomDrawer = () => {
  // Redux Dispatch hook
  const dispatch = useDispatch()

  const navigation = useNavigation()

  const [unreadMessageCount, setUnreadMessageCount] = useState(0)

  const { userInfo } = useSelector((state) => state.auth)

  const {
    conversations,
    isGetAllConversationsOfUserLoading,
    isGetAllConversationsOfUserSuccess,
    isGetAllConversationsOfUserError,
    getAllConversationsOfUserErrorMessage,
  } = useSelector((state) => state.conversation)

  useEffect(() => {
    if (isGetAllConversationsOfUserError) {
      // Toast.show({
      //   type: 'error',
      //   text1: getAllConversationsOfUserErrorMessage,
      //   visibilityTime: 3000,
      // })
      dispatch(resetGetAllConversationsOfUser())
    } else if (isGetAllConversationsOfUserSuccess) {
      let count = 0
      conversations.forEach((conversation) => {
        if (conversation?.unreadMessageCount > 0 && conversation?.lastMessage.sender !== userInfo._id) {
          count += conversation.unreadMessageCount
        }
      })
      setUnreadMessageCount(count)
      dispatch(resetGetAllConversationsOfUser())
    }
  }, [
    isGetAllConversationsOfUserError,
    getAllConversationsOfUserErrorMessage,
    isGetAllConversationsOfUserSuccess,
    conversations,
    dispatch,
  ])

  useEffect(() => {
    socket.on('getMessage', (data) => {
      dispatch(getAllConversationsOfUser())
      setUnreadMessageCount(unreadMessageCount + 1)
    })
  }, [dispatch, unreadMessageCount])

  // Get all conversations of user when component mounts
  useEffect(() => {
    dispatch(getAllConversationsOfUser())
  }, [dispatch])

  return (
    <>
      <View className='absolute bottom-3 w-[100vw] flex-row justify-between items-center'>
        <View className='w-1/2 flex-row justify-center items-center'>
          <TouchableOpacity onPress={() => navigation.navigate('UserInbox')}>
            <ChatBubbleLeftRightIcon size={40} color={'white'} />
            {unreadMessageCount > 0 && (
              <View className='absolute top-0 right-0 w-5 h-5 rounded-full bg-red-500'>
                <Text className='text-white text-xs text-center'>
                  {unreadMessageCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className='w-1/2 flex-row justify-center items-center'>
          <TouchableOpacity
            onPress={() => navigation.navigate('UserProfileEdit')}
          >
            <UserIcon size={40} color={'white'} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}

export default BottomDrawer
