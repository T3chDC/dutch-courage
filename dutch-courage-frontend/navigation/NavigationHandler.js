import { StatusBar } from 'expo-status-bar'
import { Platform } from 'react-native'
import Toast from 'react-native-toast-message'
import ToastConfig from '../utils/toastConfig'
import * as NavigationBar from 'expo-navigation-bar'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import InitialLoaderScreen from '../screens/InitialLoaderScreen'
import LoginScreen from '../screens/LoginScreen'
import SignUpScreen from '../screens/SignUpScreen'
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen'
import PasswordResetCodeScreen from '../screens/PasswordResetCodeScreen'
import PasswordResetScreen from '../screens/PasswordResetScreen'
import BlankProfileScreen from '../screens/BlankProfileScreen'
import UserProfileScreen from '../screens/UserProfileScreen'
import UserProfileEditScreen from '../screens/UserProfileEditScreen'
import UsersNearbyScreen from '../screens/UsersNearbyScreen'
import InboxScreen from '../screens/InboxScreen'
import ConversationScreen from '../screens/ConversationScreen'
import OtherUserProfileScreen from '../screens/OtherUserProfileScreen'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getInitialState } from '../features/auth/authSlice'
import { addUser, getLocation } from '../features/location/locationSlice'

const Stack = createNativeStackNavigator()

const NavigationHandler = () => {
  if (Platform.OS !== 'ios') {
    NavigationBar.setBackgroundColorAsync('#000000')
  }

  const dispatch = useDispatch()

  const { userInfo } = useSelector((state) => state.auth)

  const {
    isUserLive,
    ownLocation,
    isLocationSuccess,
    isLocationError,
    locationErrorMessage,
  } = useSelector((state) => state.location)

  // If user is live, then send location to server every 30 seconds
  useEffect(() => {
    if (isUserLive && ownLocation) {
      const interval = setInterval(() => {
        dispatch(getLocation())
      }, 30000)
      return () => clearInterval(interval)
    }
  }, [isUserLive, ownLocation])

  useEffect(() => {
    if (isLocationError) {
      Toast.show({
        type: 'error',
        text1: locationErrorMessage,
        visibilityTime: 3000,
      })
    } else if (isLocationSuccess) {
      console.log('ownLocation', ownLocation)
      //Add user to server
      dispatch(addUser(userInfo._id))
    }
  }, [ownLocation, dispatch])

  useEffect(() => {
    dispatch(getInitialState())
  }, [])

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='InitialLoader'>
          {/*Screens*/}

          {/* Home screen */}
          <Stack.Screen name='InitialLoader' component={InitialLoaderScreen} />
          {/* Login screen */}
          <Stack.Screen
            name='Login'
            component={LoginScreen}
            options={{
              headerShown: false,
            }}
          />
          {/* Forgot Password Screen */}
          <Stack.Screen
            name='ForgotPassword'
            component={ForgotPasswordScreen}
            options={{
              headerShown: false,
            }}
          />
          {/* Password Reset Code Screen */}
          <Stack.Screen
            name='PasswordResetCode'
            component={PasswordResetCodeScreen}
            options={{
              headerShown: false,
            }}
          />
          {/* Password Reset Screen */}
          <Stack.Screen
            name='PasswordReset'
            component={PasswordResetScreen}
            options={{
              headerShown: false,
            }}
          />

          {/* Sign Up Screen */}
          <Stack.Screen
            name='SignUp'
            component={SignUpScreen}
            options={{
              headerShown: false,
            }}
          />

          {/* Blank Profile Screen */}
          <Stack.Screen
            name='BlankProfile'
            component={BlankProfileScreen}
            options={{
              headerShown: false,
            }}
          />

          {/* User Profile Screen */}
          <Stack.Screen
            name='UserProfile'
            component={UserProfileScreen}
            options={{
              headerShown: false,
            }}
          />
          {/* User Profile Edit Screen */}
          <Stack.Screen
            name='UserProfileEdit'
            component={UserProfileEditScreen}
            options={{
              headerShown: false,
            }}
          />
          {/* Nearby Users Screen */}
          <Stack.Screen
            name='NearbyUsers'
            component={UsersNearbyScreen}
            options={{
              headerShown: false,
            }}
          />
          {/* Users Visit Someone else's Profile Screen */}
          <Stack.Screen
            name='OtherUserProfile'
            component={OtherUserProfileScreen}
            options={{
              headerShown: false,
            }}
          />

          {/* Inbox Screen */}
          <Stack.Screen
            name='UserInbox'
            component={InboxScreen}
            options={{
              headerShown: false,
            }}
          />

          {/* Conversation Screen */}
          <Stack.Screen
            name='Conversation'
            component={ConversationScreen}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style='light' />
      <Toast config={ToastConfig} />
    </>
  )
}

export default NavigationHandler
