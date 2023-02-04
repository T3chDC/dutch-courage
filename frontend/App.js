import { StatusBar } from 'expo-status-bar'
import * as NavigationBar from 'expo-navigation-bar'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from './screens/HomeScreen'
import LoginScreen from './screens/LoginScreen'
import SignUpScreen from './screens/SignUpScreen'
import ForgotPasswordScreen from './screens/ForgotPasswordScreen'
import PasswordResetCodeScreen from './screens/PasswordResetCodeScreen'
import PasswordResetScreen from './screens/PasswordResetScreen'

const Stack = createNativeStackNavigator()

export default function App() {
  NavigationBar.setBackgroundColorAsync('#000000')

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
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style='light' />
    </>
  )
}
