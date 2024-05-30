import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  BackHandler,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import ToggleSwitch from '../components/ToggleSwitch'
import * as Progress from 'react-native-progress'
import { logout } from '../features/auth/authSlice'
import { resetMeUser } from '../features/user/userSlice'
import { getAllConversationsOfUser } from '../features/conversation/conversationSlice'
import { NoSymbolIcon } from 'react-native-heroicons/solid'
import {
  MinusCircleIcon,
  ExclamationTriangleIcon,
  UserPlusIcon,
  ExclamationCircleIcon,
  ShieldCheckIcon,
} from 'react-native-heroicons/outline'
import axios from 'axios'
import { BACKEND_URL } from '../config'

const SettingsScreen = () => {
  // Navigation Hook
  const navigation = useNavigation()
  const route = useRoute()
  const dispatch = useDispatch()

  // Redux State variables
  const { userInfo } = useSelector((state) => state.auth)

  // UseEffect to check if the user is login or not
  useEffect(() => {
    if (!userInfo) {
      navigation.navigate('Login')
    }
  }, [userInfo, navigation])

  // Delete User Account
  const handleDeleteAccount = async () => {
    try {
      const response = await axios.delete(
        `${BACKEND_URL}/api/v1/users/${userInfo._id}`,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      )
      handleLogout()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // UseEffect when user tries to go back to profile screen
  useEffect(() => {
    const backAction = () => {
      navigation.navigate('UserProfile')
      return true
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    )

    return () => backHandler.remove()
  }, [navigation])

  const handleLogout = () => {
    dispatch(logout())
    dispatch(resetMeUser())
    navigation.navigate('Login')
  }

  return (
    <View className='bg-black flex-1'>
      <View className='flex-row items-center'>
        <TouchableOpacity
          className='mt-10 ml-4 items-center'
          onPress={() => {
            navigation.navigate('UserProfile')
          }}
        >
          <Text className='text-white text-base'>{'< Back'}</Text>
        </TouchableOpacity>

        <View className='flex-1 mt-10 items-center'>
          <Text className='text-white font-medium text-2xl'>
            Settings & Privacy
          </Text>
        </View>
      </View>

      {/* Settings Contents */}
      <View className='flex-col items-start justify-start mt-5 ml-5'>
        <View className='flex-row items-center justify-start'>
          <Text className='text-[#808080] text-base'>Account</Text>
        </View>

        {/* Logout Option */}
        <View className='flex-row items-center justify-between mt-5'>
          <View className='flex-row items-center'>
            <ExclamationTriangleIcon size={18} color={'white'} />
          </View>
          <View className='flex-row items-center'>
            <TouchableOpacity onPress={() => handleLogout()}>
              <Text className='text-[#808080] text-white text-lg left-3'>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Deactivation Option */}
        <View className='flex-row items-center justify-between mt-5'>
          <View className=' flex-row items-center'>
            <MinusCircleIcon size={20} color={'red'} />
          </View>
          <View className='flex-row items-center'>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  'Account Deletion',
                  'Are you sure you want to delete your account? This action is irreversible!',
                  [
                    {
                      text: 'Cancel',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    {
                      text: 'Delete',
                      onPress: () => handleDeleteAccount(),
                      // onPress: async () => {
                      //   try {
                      //     const response = await axios.delete(
                      //       "/api/v1/users/deleteMe"
                      //     );

                      //     if (!response.ok) {
                      //       throw new Error("Access Denied!");
                      //     }
                      //     navigation.navigate("Login");
                      //   } catch (error) {
                      //     console.error("Error:", error);
                      //   }
                      // },
                    },
                  ]
                )
              }}
            >
              <Text className='text-[#ff0000] text-lg left-3'>
                Delete Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Line Gap */}
      <View className='border-b-2 border-[#808080] mt-5 ml-5 mr-5'></View>

      {/* User Interaction Section */}
      <View className='flex-col items-start justify-start mt-5 ml-5'>
        <View className='flex-row items-center justify-start'>
          <Text className='text-[#808080] text-base'>Interact With Others</Text>
        </View>

        {/* Blocked User Option */}
        <View className='flex-row items-center justify-between mt-5'>
          <View className='flex-row items-center'>
            <NoSymbolIcon size={18} color={'white'} />
          </View>
          <View className='flex-row items-center'>
            <TouchableOpacity
              onPress={() => {
                // navigation.navigate("BlockedUsers");
              }}
            >
              <Text className='text-[#808080] text-white text-lg left-3'>
                Blocked Users
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Invite Friends */}
        <View className='flex-row items-center justify-between mt-5'>
          <View className='flex-row items-center'>
            <UserPlusIcon size={18} color={'white'} />
          </View>
          <View className='flex-row items-center'>
            <TouchableOpacity
              onPress={() => {
                // navigation.navigate("BlockedUsers");
              }}
            >
              <Text className='text-[#808080] text-white text-lg left-3'>
                Invite Friends
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Line Gap */}
      <View className='border-b-2 border-[#808080] mt-5 ml-5 mr-5'></View>

      {/* App Information Section */}
      <View className='flex-col items-start justify-start mt-5 ml-5'>
        <View className='flex-row items-center justify-start'>
          <Text className='text-[#808080] text-base'>App Info</Text>
        </View>

        {/* Privacy Policy */}
        <View className='flex-row items-center justify-between mt-5'>
          <View className='flex-row items-center'>
            <ShieldCheckIcon size={18} color={'white'} />
          </View>
          <View className='flex-row items-center'>
            <TouchableOpacity
              onPress={() => {
                // navigation.navigate("BlockedUsers");
              }}
            >
              <Text className='text-[#808080] text-white text-lg left-3'>
                Privacy Policy
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* About Us */}
        <View className='flex-row items-center justify-between mt-5'>
          <View className='flex-row items-center'>
            <ExclamationCircleIcon size={18} color={'white'} />
          </View>
          <View className='flex-row items-center'>
            <TouchableOpacity
              onPress={() => {
                // navigation.navigate("BlockedUsers");
              }}
            >
              <Text className='text-[#808080] text-white text-lg left-3'>
                About Us
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Version */}
        <View className='flex-row items-center justify-between mt-5'>
          <View className='flex-row items-center'>
            <Text className='text-[#808080] text-lg'>Version</Text>
          </View>
          <View className='flex-row items-center'>
            <Text className='text-[#808080] text-lg'> 5.0.5</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default SettingsScreen
