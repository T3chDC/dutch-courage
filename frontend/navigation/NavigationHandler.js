import { StatusBar } from 'expo-status-bar'
import Toast from 'react-native-toast-message'
import ToastConfig from '../utils/toastConfig'
import * as NavigationBar from 'expo-navigation-bar'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from '../screens/HomeScreen'
import LoginScreen from '../screens/LoginScreen'
import SignUpScreen from '../screens/SignUpScreen'
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen'
import PasswordResetCodeScreen from '../screens/PasswordResetCodeScreen'
import PasswordResetScreen from '../screens/PasswordResetScreen'
import OwnProfileScreen from '../screens/OwnProfileScreen'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getInitialState } from '../features/auth/authSlice'

const Stack = createNativeStackNavigator()

const NavigationHandler = () => {
  NavigationBar.setBackgroundColorAsync('#000000')
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
          <Stack.Screen name='Home' component={HomeScreen} />
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
          {/* Own Profile Screen */}
          <Stack.Screen
            name='OwnProfile'
            component={OwnProfileScreen}
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
