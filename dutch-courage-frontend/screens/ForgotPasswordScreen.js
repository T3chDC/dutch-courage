import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  BackHandler,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRoute, useNavigation } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import * as Progress from 'react-native-progress'
import authService from '../features/auth/authService'

const ForgotPasswordScreen = () => {
  const navigation = useNavigation()

  const [recoveryEmail, setRecoveryEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleForgotPassword = async () => {
    if (recoveryEmail === '') {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter your email',
        visibilityTime: 5000,
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
        visibilityTime: 5000,
        autoHide: true,
      })
    }, 15000) // Set timeout to 5 seconds
    const response = await authService.forgotPassword({
      email: recoveryEmail,
    })
    clearTimeout(timeout)
    setLoading(false)
    if (response.status === 'success') {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: response.message,
        visibilityTime: 5000,
        autoHide: true,
      })
      navigation.navigate('PasswordResetCode', {
        email: recoveryEmail,
      })
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: response.message,
        visibilityTime: 5000,
        autoHide: true,
      })
    }
  }

  useEffect(() => {
    const backAction = () => {
      navigation.goBack()
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
          Password Recovery
        </Text>
      </View>

      {/* Email Field */}
      <View className='mt-5'>
        <TextInput
          placeholder='Please enter your account Email'
          keyboardType='email-address'
          className='bg-[#F6F6F6] border border-[#E8E8E8] rounded-md h-12 w-80 px-4 mt-4'
          value={recoveryEmail}
          onChangeText={(text) => setRecoveryEmail(text)}
        />
      </View>
      {/* Send Recovery code Button */}
      <View className='mt-8'>
        <TouchableOpacity
          className='bg-[#22A6B3] rounded-full h-12 flex-row justify-center items-center px-4'
          onPress={handleForgotPassword}
        >
          <Text className='text-white text-base font-semibold'>
            Send Recovery Code
          </Text>
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

export default ForgotPasswordScreen
