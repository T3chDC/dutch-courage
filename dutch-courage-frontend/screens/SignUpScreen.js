import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CheckBox } from '@rneui/themed'
import React, { useEffect, useState } from 'react'
import { useRoute, useNavigation } from '@react-navigation/native'
import { GOOGLE_CLIENT_ID_EXPO, FACEBOOK_APP_ID_EXPO } from '../config'
import {
  signupLocal,
  signupGoogle,
  signupFacebook,
  resetSignUp,
} from '../features/auth/authSlice'
import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import * as Facebook from 'expo-auth-session/providers/facebook'
import * as Google from 'expo-auth-session/providers/google'
import { useDispatch, useSelector } from 'react-redux'
import Toast from 'react-native-toast-message'
import validator from 'validator'
import * as Progress from 'react-native-progress'

WebBrowser.maybeCompleteAuthSession()

const SignUpScreen = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()

  // google auth session
  const [googleRequest, googleResponse, googlePromptAsync] =
    Google.useAuthRequest({
      expoClientId: GOOGLE_CLIENT_ID_EXPO,
      iosClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
      androidClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
      webClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
    })

  // facebook auth session
  const [facebookRequest, facebookResponse, facebookPromptAsync] =
    Facebook.useAuthRequest({
      clientId: FACEBOOK_APP_ID_EXPO,
    })

  //local state variables
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreedChecked, setAgreedChecked] = useState(false)

  const {
    userInfo,
    isSignUpSuccess,
    isSignUpLoading,
    isSignUpError,
    signUpErrorMessage,
  } = useSelector((state) => state.auth)

  useEffect(() => {
    if (userInfo && userInfo.newUser) {
      navigation.navigate('BlankProfile')
    } else if (userInfo && !userInfo.newUser) {
      navigation.navigate('UserProfile')
    }
  }, [userInfo, navigation])

  useEffect(() => {
    if (isSignUpSuccess) {
      Toast.show({
        type: 'success',
        text1: 'Sign Up Successful',
        text2: 'Your Account Was Created Successfully',
        visibilityTime: 5000,
      })
      dispatch(resetSignUp())
    } else if (isSignUpError) {
      Toast.show({
        type: 'error',
        text1: 'Sign Up Failed',
        text2: signUpErrorMessage,
        visibilityTime: 5000,
      })
      dispatch(resetSignUp())
    }
  }, [isSignUpSuccess, isSignUpError, signUpErrorMessage, dispatch, navigation])

  useEffect(() => {
    return () => {
      dispatch(resetSignUp())
    }
  }, [dispatch])

  //regex patterns for username validation
  const userNamePattern = /^[a-zA-Z0-9_]{6,32}$/
  //regex patterns for password validation
  const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z0-9]).{8,}$/

  //function to handle signup and check validity of fields
  const handleSignUp = () => {
    if (userName === '') {
      Toast.show({
        type: 'error',
        text1: 'Username cannot be empty',
        text2: 'Please enter a valid username',
        visibilityTime: 5000,
      })
    } else if (!userNamePattern.test(userName)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid username',
        text2:
          'Username must be 6-32 characters long and can only contain letters, numbers and underscores',
        visibilityTime: 5000,
      })
    } else if (email === '') {
      Toast.show({
        type: 'error',
        text1: 'Email cannot be empty',
        text2: 'Please enter a valid email',
        visibilityTime: 5000,
      })
    } else if (!validator.isEmail(email)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid email',
        text2: 'Please enter a valid email address',
        visibilityTime: 5000,
      })
    } else if (password === '') {
      Toast.show({
        type: 'error',
        text1: 'Password cannot be empty',
        text2: 'Please enter a valid password',
        visibilityTime: 5000,
      })
    } else if (!passwordPattern.test(password)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid password',
        text2:
          'Password must be 8 characters long and must contain at least one uppercase letter and one special character',
        visibilityTime: 5000,
      })
    } else if (!agreedChecked) {
      Toast.show({
        type: 'error',
        text1: 'Please agree to the terms and conditions to continue',
        visibilityTime: 5000,
      })
    } else {
      dispatch(
        signupLocal({
          userName,
          email,
          password,
          loginType: 'local',
        })
      )
    }
  }

  //function to handle google signup
  const handleGoogleSignUp = async () => {
    try {
      await googlePromptAsync()
    } catch (error) {
      console.log(error)
    }
  }

  //function to handle facebook signup
  const handleFacebookSignUp = async () => {
    try {
      await facebookPromptAsync()
    } catch (error) {
      console.log(error)
    }
  }

  //handle google signup response
  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const { access_token } = googleResponse.params
      dispatch(signupGoogle({ access_token }))
    } else if (googleResponse?.type === 'error') {
      Toast.show({
        type: 'error',
        text1: 'Sign Up Failed',
        text2: 'Something went wrong. Please try again',
        visibilityTime: 3000,
      })
    }
  }, [googleResponse, dispatch])

  //handle facebook signup response
  useEffect(() => {
    if (
      facebookResponse?.type === 'success' &&
      facebookResponse?.authentication
    ) {
      const { accessToken } = facebookResponse.authentication
      dispatch(signupFacebook({ access_token: accessToken }))
    } else if (facebookResponse?.type === 'error') {
      Toast.show({
        type: 'error',
        text1: 'Sign Up Failed',
        text2: 'Something went wrong. Please try again',
        visibilityTime: 3000,
      })
    }
  }, [facebookResponse, dispatch])

  return (
    <SafeAreaView className='bg-black flex-1 justify-start items-center'>
      {/* Page Heading */}
      <View className='mt-8'>
        <Text className='text-[#22A6B3] font-semibold text-3xl'>Sign Up</Text>
      </View>

      {isSignUpLoading ? (
        <>
          {/* Loading Screen */}
          <View className='flex-1 justify-center items-center'>
            <Text className='text-[#22A6B3] text-xl font-semibold mb-8'>
              Creating an Account...
            </Text>
            <Progress.CircleSnail
              color={['#22A6B3', '#22A6B3', '#22A6B3']}
              size={100}
              thickness={5}
            />
          </View>
        </>
      ) : (
        <>
          {/* UserName Field */}
          <View className='mt-5'>
            <TextInput
              placeholder='Username'
              keyboardType='default'
              className='bg-[#F6F6F6] border border-[#E8E8E8] rounded-md h-12 w-80 px-4'
              value={userName}
              onChangeText={(text) => setUserName(text.trim())}
            />
          </View>
          {/* Email Field */}
          <View>
            <TextInput
              placeholder='Email'
              keyboardType='email-address'
              className='bg-[#F6F6F6] border border-[#E8E8E8] rounded-md h-12 w-80 px-4 mt-4'
              value={email}
              onChangeText={(text) => setEmail(text.trim())}
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
              onChangeText={(text) => setPassword(text.trim())}
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
              <Text className='text-white text-base font-semibold'>
                Sign Up
              </Text>
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
            <TouchableOpacity
              className='bg-[#F6F6F6] rounded-md h-12 w-80 flex-row justify-center items-center'
              onPress={() => handleGoogleSignUp()}
            >
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
              onPress={() => handleFacebookSignUp()}
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
              <Text className='text-[#22A6B3] text-base font-medium '>
                Log In
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  )
}

export default SignUpScreen
