import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  BackHandler,
} from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRoute, useNavigation } from '@react-navigation/native'
import authService from '../features/auth/authService'
import Toast from 'react-native-toast-message'
import * as Progress from 'react-native-progress'

const PasswordResetCodeScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()

  const { email } = route.params

  const refs = useRef([])

  const [otp, setOtp] = useState(Array(6).fill(''))
  const [otpString, setOtpString] = useState('')
  const [loading, setLoading] = useState(false)

  const handleOtpSubmit = async () => {
    if (otpString.length !== 6) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a valid code',
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
    const response = await authService.verifyPasswordResetOtp({
      email,
      passwordResetOTP: otpString * 1,
    })
    clearTimeout(timeout)
    setLoading(false)
    if (response.status === 'success') {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'OTP verified successfully, please reset your password',
        visibilityTime: 3000,
        autoHide: true,
      })
      navigation.navigate('PasswordReset', {
        resetToken: response.data.resetToken,
      })
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
      navigation.navigate('ForgotPassword')
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
          Enter Code
        </Text>
      </View>
      {/* Code Field */}
      <View className='flex-row bg-[#F6F6F6] border border-[#E8E8E8] rounded-md h-12 w-80 px-4 mt-5 justify-center'>
        {/* OTP Input Fields */}
        {otp.map((data, index) => (
          <TextInput
            key={index}
            style={{
              width: 20,
              height: 40,
              fontSize: 20,
              marginHorizontal: 5,
              borderBottomWidth: 2,
              borderColor: '#BDBDBD',
              textAlign: 'center',
              marginRight: 10,
            }}
            keyboardType='number-pad'
            maxLength={1}
            value={data}
            onFocus={() => {
              if (index !== 0 && otp[index - 1] === '') {
                refs.current[index - 1].focus()
              } else if (index === 1 && otp[0] === '') {
                refs.current[0].focus()
              }
            }}
            onChangeText={(text) => {
              if (isNaN(text)) {
                return
              }
              otp[index] = text
              setOtp([...otp])
              if (text !== '') {
                if (index !== otp.length - 1) {
                  refs.current[index + 1].focus()
                }
              } else {
                if (index !== 0) {
                  refs.current[index - 1].focus()
                }
              }
              setOtpString(otp.join(''))
              console.log(otpString.length, index)
            }}
            onKeyPress={(e) => {
              if (e.nativeEvent.key === 'Backspace') {
                if (index !== 0) {
                  refs.current[index - 1].focus()
                }
              }
            }}
            ref={(ref) => (refs.current[index] = ref)}
          />
        ))}
      </View>
      {/* Send Recovery code Button */}
      <View className='mt-8'>
        <TouchableOpacity
          className='bg-[#22A6B3] rounded-full h-12 flex-row justify-center items-center px-4'
          onPress={handleOtpSubmit}
        >
          <Text className='text-white text-base font-semibold'>Submit</Text>
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

export default PasswordResetCodeScreen
