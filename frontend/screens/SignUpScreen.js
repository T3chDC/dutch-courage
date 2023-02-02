import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute, useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'

const SignUpScreen = () => {
  return (
    <SafeAreaView className='bg-black flex-1 justify-start items-center'>
      <View>
        <Text className='text-[#22A6B3]'>Sign Up</Text>
      </View>
    </SafeAreaView>
  )
}

export default SignUpScreen
