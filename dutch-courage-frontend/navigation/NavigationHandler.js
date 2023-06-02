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
import InboxScreen from '../screens/InboxScreen'
import ConversationScreen from '../screens/ConversationScreen'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getInitialState } from '../features/auth/authSlice'

const Stack = createNativeStackNavigator()

const NavigationHandler = () => {
  if (Platform.OS !== 'ios') {
    NavigationBar.setBackgroundColorAsync('#000000')
  }

  const dispatch = useDispatch()

  const { userInfo } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(getInitialState())
  }, [])

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          {/*Screens*/}

          {/* Home screen */}
          <Stack.Screen name='InitialLoaader' component={InitialLoaderScreen} />
          {/* Login screen */}
          <Stack.Screen
            name='Login'
            component={LoginScreen}
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
