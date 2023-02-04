import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRoute, useNavigation } from '@react-navigation/native'

const PasswordResetCodeScreen = () => {
  const navigation = useNavigation()

  const [otp, setOtp] = useState(Array(6).fill(''))
  const [otpString, setOtpString] = useState('')

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
            }}
            keyboardType='number-pad'
            returnKeyType='done'
            maxLength={1}
            onChangeText={(text) => {
              setOtp([...otp.map((d, idx) => (idx === index ? text : d))])
            }}
            value={data}
          />
        ))}
      </View>
      {/* Send Recovery code Button */}
      <View className='mt-8'>
        <TouchableOpacity
          className='bg-[#22A6B3] rounded-full h-12 flex-row justify-center items-center px-4'
          onPress={() => navigation.navigate('PasswordReset')}
        >
          <Text className='text-white text-base font-semibold'>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default PasswordResetCodeScreen
