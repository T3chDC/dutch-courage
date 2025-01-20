import { StatusBar } from 'expo-status-bar'
import { Platform, AppState } from 'react-native'
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
import SettingsScreen from '../screens/SettingsScreen'
import UsersNearbyScreen from '../screens/UsersNearbyScreen'
import InboxScreen from '../screens/InboxScreen'
import LocationFinderScreen from '../screens/LocationFinderScreen'
import ConversationScreen from '../screens/ConversationScreen'
import OtherUserProfileScreen from '../screens/OtherUserProfileScreen'
import OtherUserProfileView from '../screens/OtherUserProfileView'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getInitialState } from '../features/auth/authSlice'
import {
  addUser,
  getLocation,
  removeUser,
} from '../features/location/locationSlice'
import { useState } from 'react'

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

  const [appState, setAppState] = useState(AppState.currentState)

  // If user is live, then send location to server every 30 seconds
  useEffect(() => {
    if (isUserLive && ownLocation) {
      const interval = setInterval(() => {
        dispatch(getLocation())
        // userInfo && socket.emit('addUser', userInfo._id)
        // socket.on('getUsers', (users) => {
        //   console.log(users)
        // })
      }, 30000)
      return () => clearInterval(interval)
    }
  }, [isUserLive, ownLocation, userInfo])

  useEffect(() => {
    if (isLocationError) {
      Toast.show({
        type: 'error',
        text1: locationErrorMessage,
        visibilityTime: 3000,
      })
    } else if (isLocationSuccess) {
      // console.log('ownLocation', ownLocation)
      //Add user to server
      userInfo && dispatch(addUser(userInfo._id))
    }
  }, [ownLocation, dispatch, userInfo])

  useEffect(() => {
    dispatch(getInitialState())
  }, [])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      setAppState(nextAppState)
      if (nextAppState === 'background') {
        console.log('App is in the background')
        // Remove user from server
        userInfo && dispatch(removeUser(userInfo._id))
      } else if (nextAppState === 'active') {
        console.log('App is in the foreground')
        // Add user to server
        // userInfo && dispatch(addUser(userInfo._id))
      }
    })

    return () => {
      subscription.remove()
    }
  }, [])

  // Send userId to socket server on connection every second
  // useEffect(() => {
  //   if (userInfo) {
  //     const interval = setInterval(() => {
  //       userInfo && socket.emit('addUser', userInfo._id)
  //       socket.on('getUsers', (users) => {
  //         console.log(users)
  //       })
  //     }, 1000)
  //     return () => clearInterval(interval)
  //   }
  // }, [userInfo])

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
          {/* Settings Screen */}
          <Stack.Screen
            name='Settings'
            component={SettingsScreen}
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
          {/* Location Finder Screen */}
          <Stack.Screen
            name='LocationFinder'
            component={LocationFinderScreen}
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

          {/* Other User Profile View */}
          <Stack.Screen
            name='OtherUserProfileView'
            component={OtherUserProfileView}
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
