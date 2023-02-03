import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRoute, useNavigation } from '@react-navigation/native'

const LoginScreen = () => {
  const navigation = useNavigation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  return (
    <KeyboardAvoidingView className='bg-black flex-1 justify-start items-center'>
      {/* Page Heading */}
      <View className='mt-12'>
        <Text className='text-[#22A6B3] font-semibold text-3xl'>Log In</Text>
      </View>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen
