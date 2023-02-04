import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRoute, useNavigation } from '@react-navigation/native'

const LoginScreen = () => {
  const navigation = useNavigation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  return (
    <SafeAreaView className='bg-black flex-1 justify-start items-center'>
      {/* Page Heading */}
      <View className='mt-8'>
        <Text className='text-[#22A6B3] font-semibold text-3xl'>Log In</Text>
      </View>
      {/* Email Field */}
      <View className='mt-5'>
        <TextInput
          placeholder='Email'
          keyboardType='email-address'
          className='bg-[#F6F6F6] border border-[#E8E8E8] rounded-md h-12 w-80 px-4 mt-4'
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
      </View>
      {/* Password Field */}
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
          <Text className='text-[#22A6B3] text-base font-medium '>
            {showPassword ? 'Hide' : 'Show'}
          </Text>
        </TouchableOpacity>
      </View>
      {/* Log in Button */}
      <View className='mt-4'>
        <TouchableOpacity
          className='bg-[#22A6B3] rounded-full h-12 w-80 flex-row justify-center items-center'
          // onPress={() => navigation.navigate('Home')}
        >
          <Text className='text-white text-base font-semibold'>Log In</Text>
        </TouchableOpacity>
      </View>
      {/* Forgot Password */}
      <View className='mt-4'>
        <TouchableOpacity
          className='rounded-md flex-row justify-center items-center'
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text className='text-[#22A6B3] text-base font-semibold'>
            Forgot your password?
          </Text>
        </TouchableOpacity>
      </View>
      {/* Or */}
      <View className='mt-4'>
        <View className='mt-3 flex-row space-x-2 justify-center items-center'>
          <View className='h-0.5 w-20 bg-[#A1A5AC]' />
          <Text className='text-[#A1A5AC] text-base font-medium'>Or</Text>
          <View className='h-0.5 w-20 bg-[#A1A5AC]' />
        </View>
      </View>
      {/* Google Log in */}
      <View className='mt-8'>
        <TouchableOpacity
          className='bg-[#F6F6F6] rounded-md h-12 w-80 flex-row justify-center items-center'
          // onPress={() => navigation.navigate('Home')}
        >
          <Image
            source={require('../assets/projectImages/google.png')}
            className='h-6 w-6'
          />
          <Text className='text-[#666666] text-base font-medium ml-4'>
            Log In with Google
          </Text>
        </TouchableOpacity>
      </View>
      {/* Facebook Log in */}
      <View className='mt-4'>
        <TouchableOpacity
          className='bg-[#F6F6F6] rounded-md h-12 w-80 flex-row justify-center items-center'
          // onPress={() => navigation.navigate('Home')}
        >
          <Image
            source={require('../assets/projectImages/facebook.png')}
            className='h-8 w-8'
          />
          <Text className='text-[#666666] text-base font-medium ml-4'>
            Log In with Facebook
          </Text>
        </TouchableOpacity>
      </View>
      {/* Don't have an account? */}
      <View className='mt-16 flex-row space-x-2 justify-center items-center'>
        <Text className='text-[#666666] text-sm font-normal'>
          Don't have an account?
        </Text>
        <TouchableOpacity
          className='flex-row justify-center items-center'
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text className='text-[#22A6B3] text-base font-medium '>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default LoginScreen
