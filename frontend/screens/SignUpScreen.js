import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CheckBox } from '@rneui/themed'
import React, { useEffect, useState } from 'react'
import { useRoute, useNavigation } from '@react-navigation/native'

const SignUpScreen = () => {
  const navigation = useNavigation()

  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreedChecked, setAgreedChecked] = useState(false)

  return (
    <SafeAreaView className='bg-black flex-1 justify-start items-center'>
      <View className='mt-8'>
        <Text className='text-[#22A6B3] font-semibold text-3xl'>Sign Up</Text>
      </View>
      <View className='mt-5'>
        <TextInput
          placeholder='Username'
          keyboardType='default'
          className='bg-[#F6F6F6] border border-[#E8E8E8] rounded-md h-12 w-80 px-4'
          value={userName}
          onChangeText={(text) => setUserName(text)}
        />
      </View>
      <View>
        <TextInput
          placeholder='Email'
          keyboardType='email-address'
          className='bg-[#F6F6F6] border border-[#E8E8E8] rounded-md h-12 w-80 px-4 mt-4'
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
      </View>
      <View className='flex-row bg-[#F6F6F6] border border-[#E8E8E8] rounded-md h-12 w-80 px-4 mt-4'>
        <TextInput
          placeholder='Password'
          secureTextEntry={!showPassword}
          keyboardType='default'
          className='bg-[#F6F6F6] flex-1 w-64'
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity
          className='flex-row justify-center items-center'
          onPress={() => setShowPassword(!showPassword)}
        >
          <Text className='text-[#22A6B3] text-base font-medium '>Show</Text>
        </TouchableOpacity>
      </View>
      <View className='flex-row space-x-0 mt-2 items-center justify-center pr-6'>
        <CheckBox
          checked={agreedChecked}
          iconType='material-community'
          checkedIcon='checkbox-outline'
          uncheckedIcon={'checkbox-blank-outline'}
          onPress={() => setAgreedChecked(!agreedChecked)}
          containerStyle={{
            backgroundColor: 'transparent',
            borderWidth: 0,
            marginRight: 0,
          }}
        />
        <Text className='text-[#666666] text-sm font-normal ml-2'>
          I accept the terms and conditions
        </Text>
      </View>
    </SafeAreaView>
  )
}

export default SignUpScreen
