import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRoute, useNavigation } from '@react-navigation/native'

const PasswordResetCodeScreen = () => {
  const navigation = useNavigation()

  const [code, setCode] = useState('')

  return (
    <SafeAreaView className='bg-black flex-1 justify-start items-center'>
      {/* Page Heading */}
      <View className='mt-8'>
        <Text className='text-[#22A6B3] font-semibold text-3xl'>
          Enter Code
        </Text>
      </View>
      {/* Code Field */}
      <View className='mt-5'>
        <TextInput
          placeholder=''
          keyboardType='default'
          className='bg-[#F6F6F6] border border-[#E8E8E8] rounded-md h-12 w-80 px-4 mt-4'
          value={code}
          onChangeText={(text) => setCode(text)}
        />
      </View>
      {/* Send Recovery code Button */}
      <View className='mt-8'>
        <TouchableOpacity
          className='bg-[#22A6B3] rounded-full h-12 flex-row justify-center items-center px-4'
          onPress={() => navigation.navigate('PasswordReset')}
        >
          <Text className='text-white text-base font-semibold'>
            Submit
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default PasswordResetCodeScreen
