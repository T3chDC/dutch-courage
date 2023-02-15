import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CheckBox } from '@rneui/themed'
import React, { useEffect, useState } from 'react'
import { useRoute, useNavigation } from '@react-navigation/native'
import Toast from 'react-native-toast-message'

const SignUpScreen = () => {
  const navigation = useNavigation()

  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreedChecked, setAgreedChecked] = useState(false)

  //regex patterns for username validation
  const userNamePattern = /^[a-zA-Z0-9_]{6,32}$/

  //function to handle signup and check validity of fields
  const handleSignUp = () => {
    if (userName === '') {
      Toast.show({
        type: 'error',
        text1: 'Username cannot be empty',
        text2: 'Please enter a valid username',
        visibilityTime: 2000,
      })
    } else if (!userNamePattern.test(userName)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid username',
        text2:
          'Username must be 6-32 characters long and can only contain letters, numbers and underscores',
        visibilityTime: 10000,
      })
    } else if (email === '') {
      Toast.show({
        type: 'error',
        text1: 'Email cannot be empty',
        text2: 'Please enter a valid email',
        visibilityTime: 2000,
      })
    } else if (password === '') {
      Toast.show({
        type: 'error',
        text1: 'Password cannot be empty',
        text2: 'Please enter a valid password',
        visibilityTime: 2000,
      })
    } else if (!agreedChecked) {
      Toast.show({
        type: 'error',
        text1: 'Please agree to the terms and conditions',
        visibilityTime: 2000,
      })
    } else {
      Toast.show({
        type: 'success',
        text1: 'Account created successfully',
        visibilityTime: 2000,
      })
      navigation.navigate('OwnProfile')
    }
  }

  return (
    <SafeAreaView className='bg-black flex-1 justify-start items-center'>
      {/* Page Heading */}
      <View className='mt-8'>
        <Text className='text-[#22A6B3] font-semibold text-3xl'>Sign Up</Text>
      </View>
      {/* UserName Field */}
      <View className='mt-5'>
        <TextInput
          placeholder='Username'
          keyboardType='default'
          className='bg-[#F6F6F6] border border-[#E8E8E8] rounded-md h-12 w-80 px-4'
          value={userName}
          onChangeText={(text) => setUserName(text)}
        />
      </View>
      {/* Email Field */}
      <View>
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
      {/* Terms and Conditions */}
      <View className='flex-row space-x-0 mt-2 items-center justify-center'>
        <CheckBox
          checked={agreedChecked}
          iconType='material-community'
          checkedIcon='checkbox-outline'
          uncheckedIcon={'checkbox-blank-outline'}
          onPress={() => setAgreedChecked(!agreedChecked)}
          containerStyle={{
            backgroundColor: 'transparent',
            borderWidth: 0,
            marginRight: 2,
            marginLeft: 0,
            padding: 0,
          }}
        />
        <Text className='text-[#666666] text-sm font-normal ml-2'>
          I accept the terms and conditions.
        </Text>
      </View>
      {/* Sign Up Button */}
      <View className='mt-2'>
        <TouchableOpacity
          className='bg-[#22A6B3] rounded-full h-12 w-80 flex-row justify-center items-center'
          onPress={() => handleSignUp()}
        >
          <Text className='text-white text-base font-semibold'>Sign Up</Text>
        </TouchableOpacity>
      </View>
      {/* Or */}
      <View className='mt-6'>
        <View className='mt-8 flex-row space-x-2 justify-center items-center'>
          <View className='h-0.5 w-20 bg-[#A1A5AC]' />
          <Text className='text-[#A1A5AC] text-base font-medium'>Or</Text>
          <View className='h-0.5 w-20 bg-[#A1A5AC]' />
        </View>
      </View>
      {/* Google Sign Up */}
      <View className='mt-8'>
        <TouchableOpacity className='bg-[#F6F6F6] rounded-md h-12 w-80 flex-row justify-center items-center'>
          <Image
            source={require('../assets/projectImages/google.png')}
            className='h-6 w-6'
          />
          <Text className='text-[#666666] text-base font-medium ml-4'>
            Sign Up with Google
          </Text>
        </TouchableOpacity>
      </View>
      {/* Facebook SignUp */}
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
            Sign Up with Facebook
          </Text>
        </TouchableOpacity>
      </View>
      {/* Already have an account? */}
      <View className='mt-16 flex-row space-x-2 justify-center items-center'>
        <Text className='text-[#666666] text-sm font-normal'>
          Already have an account?
        </Text>
        <TouchableOpacity
          className='flex-row justify-center items-center'
          onPress={() => navigation.navigate('Login')}
        >
          <Text className='text-[#22A6B3] text-base font-medium '>Log In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default SignUpScreen
