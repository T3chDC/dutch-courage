import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  BackHandler,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { GOOGLE_CLIENT_ID_EXPO, FACEBOOK_APP_ID_EXPO } from '../config'
import {
  signinLocal,
  signinGoogle,
  signinFacebook,
  resetSignIn,
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

const LoginScreen = () => {
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

  // Local State variables
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const {
    userInfo,
    isSignInSuccess,
    isSignInLoading,
    isSignInError,
    signInErrorMessage,
  } = useSelector((state) => state.auth)

  //Exit App on Back Press
  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        'Hold on!',
        'Are you sure you want to exit the app?',
        [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          { text: 'YES', onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: false }
      )
      return true
    }
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    )
    return () => backHandler.remove()
  }, [])

  useEffect(() => {
    if (userInfo && userInfo.newUser) {
      navigation.replace('BlankProfile')
    } else if (userInfo && !userInfo.newUser) {
      navigation.replace('UserProfile')
    }
  }, [userInfo, navigation])

  useEffect(() => {
    if (isSignInSuccess) {
      Toast.show({
        type: 'success',
        text1: 'Log In Successful',
        text2: 'You Have Successfully Logged In',
        visibilityTime: 5000,
      })
      dispatch(resetSignIn())
    } else if (isSignInError) {
      Toast.show({
        type: 'error',
        text1: 'Log In Failed',
        text2: signInErrorMessage,
        visibilityTime: 5000,
      })
      dispatch(resetSignIn())
    }
  }, [isSignInSuccess, isSignInError, signInErrorMessage, dispatch, navigation])

  useEffect(() => {
    return () => {
      dispatch(resetSignIn())
    }
  }, [dispatch])

  const handleLogin = () => {
    if (email === '') {
      Toast.show({
        type: 'error',
        text1: 'Email cannot be empty',
        text2: 'Please enter a valid email',
        visibilityTime: 5000,
      })
    } else if (!validator.isEmail(email)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Email',
        text2: 'Please enter a valid email',
        visibilityTime: 5000,
      })
    } else if (password === '') {
      Toast.show({
        type: 'error',
        text1: 'Password cannot be empty',
        text2: 'Please enter a valid password',
        visibilityTime: 5000,
      })
    } else {
      dispatch(signinLocal({ email, password }))
    }
  }

  // function to handle google login
  const handleGoogleLogin = async () => {
    try {
      await googlePromptAsync()
    } catch (error) {
      console.log(error)
    }
  }

  // function to handle facebook login
  const handleFacebookLogin = async () => {
    try {
      await facebookPromptAsync()
    } catch (error) {
      console.log(error)
    }
  }

  // handle google login response
  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const { access_token } = googleResponse.params
      dispatch(signinGoogle({ access_token }))
    } else if (googleResponse?.type === 'error') {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: 'Something went wrong. Please try again',
        visibilityTime: 5000,
      })
    }
  }, [googleResponse, dispatch])

  // handle facebook login response
  useEffect(() => {
    if (
      facebookResponse?.type === 'success' &&
      facebookResponse?.authentication
    ) {
      const { accessToken } = facebookResponse.authentication
      dispatch(signinFacebook({ access_token: accessToken }))
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
        <Text className='text-[#22A6B3] font-semibold text-3xl'>Log In</Text>
      </View>

      {isSignInLoading ? (
        <>
          {/* Loading Screen */}
          <View className='flex-1 justify-center items-center'>
            <Text className='text-[#22A6B3] text-xl font-semibold mb-8'>
              Logging In...
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
              onPress={handleLogin}
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
              onPress={() => handleGoogleLogin()}
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
              onPress={() => handleFacebookLogin()}
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
              <Text className='text-[#22A6B3] text-base font-medium '>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  )
}

export default LoginScreen
