import { View, Text, TouchableOpacity } from 'react-native'
import {
  UserIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
} from 'react-native-heroicons/solid'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import socket from '../utils/socketInit'
import {
  getAllConversationsOfUser,
  resetGetAllConversationsOfUser,
} from '../features/conversation/conversationSlice'
import { addExpoPushToken } from '../features/auth/authSlice'
import { useNavigation } from '@react-navigation/native'
import notificationSound from '../assets/notification.mp3'
import { Audio } from 'expo-av'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'
import { Platform } from 'react-native'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

function handleRegistrationError(errorMessage) {
  alert(errorMessage)
  throw new Error(errorMessage)
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    })
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      handleRegistrationError(
        'Permission not granted to get push token for push notification!'
      )
      return
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId
    if (!projectId) {
      handleRegistrationError('Project ID not found')
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data
      console.log(pushTokenString)
      return pushTokenString
    } catch (e) {
      handleRegistrationError(`${e}`)
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications')
  }
}

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

  const [expoPushToken, setExpoPushToken] = useState('')

  // Send userId to socket server on connection
  useEffect(() => {
    socket.emit('addUser', userInfo._id)
    // socket.on('getUsers', (users) => {
    //   console.log(users)
    // })
  }, [userInfo])

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        setExpoPushToken(token ?? '')
        // Save the push token to the user's document in the database
        // dispatch(addExpoPushToken(token))
      })
      .catch((error) => setExpoPushToken(`${error}`))
  }, [])

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
        if (
          conversation?.unreadMessageCount > 0 &&
          conversation?.lastMessage.sender !== userInfo._id
        ) {
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

  // Function to play sound
  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(notificationSound)
    await sound.playAsync()
  }

  // Function to send push notoification
  const sendPushNotification = async () => {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'You have a new message',
      body: 'Please check your inbox',
    }

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })
  }

  // Functin to handle local notification
  // const sendPushNotification = async () => {
  //   await Notifications.scheduleNotificationAsync({
  //     content: {
  //       title: 'You have a new message',
  //       body: 'Please check your inbox',
  //       sound: 'default',
  //     },
  //     trigger: null,
  //   })
  // }

  // useEffect(() => {
  //   socket.on('getMessage', (data) => {
  //     dispatch(getAllConversationsOfUser())
  //     // Play notificaiton sound of the device
  //     // playSound()
  //     sendPushNotification()
  //     setUnreadMessageCount(unreadMessageCount + 1)
  //   })
  // }, [dispatch, unreadMessageCount])

  // On socket event getMessage, get all conversations of user amd play notification sound. Make sure only one listener is attached to the event
  useEffect(() => {
    socket.on('getMessage', (data) => {
      dispatch(getAllConversationsOfUser())
      sendPushNotification()
      setUnreadMessageCount(unreadMessageCount + 1)
    })
    return () => {
      socket.off('getMessage')
    }
  }, [dispatch, unreadMessageCount])

  // Get all conversations of user when component mounts
  useEffect(() => {
    dispatch(getAllConversationsOfUser())
  }, [dispatch])

  return (
    <>
      <View className='absolute bottom-3 w-[100vw] flex-row justify-between items-center'>
        <View className='w-1/3 flex-row justify-center items-center'>
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

        <View className='w-1/3 flex-row justify-center items-center'>
          <TouchableOpacity
            onPress={() => navigation.navigate('UserProfileEdit')}
          >
            <UserIcon size={40} color={'white'} />
          </TouchableOpacity>
        </View>

        <View className='w-1/3 flex-row justify-center items-center'>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Cog6ToothIcon size={40} color={'white'} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}

export default BottomDrawer
