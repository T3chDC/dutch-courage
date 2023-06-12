import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  BackHandler,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRoute, useNavigation } from '@react-navigation/native'
import authService from '../features/auth/authService'
import Toast from 'react-native-toast-message'
import * as Progress from 'react-native-progress'

const PasswordResetScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()

  const { resetToken } = route.params
  // console.log(resetToken)

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  //regex patterns for password validation
  const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z0-9]).{8,}$/

  const handleResetPassword = async () => {
    if (newPassword === '') {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter your new password',
        visibilityTime: 3000,
        autoHide: true,
      })
      return
    }
    if (!passwordPattern.test(newPassword)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Password',
        text2:
          'Password must be 8 characters long and must contain at least one uppercase letter and one special character',
        visibilityTime: 3000,
        autoHide: true,
      })
      return
    }
    if (confirmPassword === '') {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please confirm your new password',
        visibilityTime: 3000,
        autoHide: true,
      })
      return
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Password and Confirmed passwords do not match',
        visibilityTime: 3000,
        autoHide: true,
      })
      return
    }
    setLoading(true)
    const timeout = setTimeout(() => {
      setLoading(false)
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Request timed out. Please try again',
        visibilityTime: 3000,
        autoHide: true,
      })
    }, 15000) // Set timeout to 5 seconds
    const response = await authService.resetPassword({
      resetToken,
      password: newPassword,
    })
    clearTimeout(timeout)
    setLoading(false)
    if (response.status === 'success') {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Password reset successful',
        visibilityTime: 3000,
        autoHide: true,
      })
      navigation.navigate('Login')
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: response.message,
        visibilityTime: 3000,
        autoHide: true,
      })
    }
  }

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('Login')
      return true
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    )

    return () => backHandler.remove()
  }, [])

  return (
    <SafeAreaView className='bg-black flex-1 justify-start items-center'>
      {/* Page Heading */}
      <View className='mt-8'>
        <Text className='text-[#22A6B3] font-semibold text-3xl'>
          Password Reset
        </Text>
      </View>
      {/* New Password Field */}
      <View className='flex-row bg-[#F6F6F6] border border-[#E8E8E8] rounded-md h-12 w-80 px-4 mt-4'>
        <TextInput
          placeholder='New Password'
          secureTextEntry={!showNewPassword}
          keyboardType='default'
          className='bg-[#F6F6F6] flex-1 w-64'
          value={newPassword}
          onChangeText={(text) => setNewPassword(text)}
        />
        <TouchableOpacity
          className='flex-row justify-center items-center'
          onPress={() => setShowNewPassword(!showNewPassword)}
        >
          <Text className='text-[#22A6B3] text-base font-medium '>
            {showNewPassword ? 'Hide' : 'Show'}
          </Text>
        </TouchableOpacity>
      </View>
      {/* Confirm Password Field */}
      <View className='flex-row bg-[#F6F6F6] border border-[#E8E8E8] rounded-md h-12 w-80 px-4 mt-4'>
        <TextInput
          placeholder='Confirm Password'
          secureTextEntry={!showConfirmPassword}
          keyboardType='default'
          className='bg-[#F6F6F6] flex-1 w-64'
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
        />
        <TouchableOpacity
          className='flex-row justify-center items-center'
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <Text className='text-[#22A6B3] text-base font-medium '>
            {showConfirmPassword ? 'Hide' : 'Show'}
          </Text>
        </TouchableOpacity>
      </View>
      {/* Save Button */}
      <View className='mt-8'>
        <TouchableOpacity
          className='bg-[#22A6B3] rounded-full h-12 flex-row justify-center items-center px-10'
          onPress={handleResetPassword}
        >
          <Text className='text-white text-base font-semibold'>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Loading Indicator */}
      {loading && (
        <View className='mt-8'>
          <Progress.CircleSnail
            color={['#22A6B3', '#22A6B3', '#22A6B3']}
            size={60}
          />
        </View>
      )}
    </SafeAreaView>
  )
}

export default PasswordResetScreen
