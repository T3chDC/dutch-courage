import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRoute, useNavigation } from '@react-navigation/native'

const PasswordResetScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()

  const { resetToken } = route.params
  console.log(resetToken)

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
          onPress={() => navigation.navigate('Login')}
        >
          <Text className='text-white text-base font-semibold'>Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default PasswordResetScreen
