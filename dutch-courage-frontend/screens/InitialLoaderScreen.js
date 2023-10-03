import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Animatable from 'react-native-animatable'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../features/auth/authSlice'

const InitialLoaderScreen = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()

  const { userInfo } = useSelector((state) => state.auth)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [navigation])

  const handleLogout = () => {
    dispatch(logout())
  }

  useEffect(() => {
    setTimeout(() => {
      if (userInfo && userInfo.newUser) {
        navigation.navigate('BlankProfile')
      } else if (userInfo && userInfo.newUser === false) {
        navigation.navigate('UserProfile')
      } else {
        navigation.navigate('Login')
      }
    }, 4000)
  }, [userInfo, navigation])

  return (
    <SafeAreaView className='bg-black flex-1 justify-center items-center'>
      <Animatable.Image
        source={require('../assets/projectImages/TempLogo1.png')}
        animation='fadeIn'
        iterationCount={1}
        className='h-96 w-[100vw] rounded-lg'
      />
      <Animatable.View
        animation='slideInUp'
        iterationCount={1}
        className='flex-row justify-between w-80 mt-10'
      >
        {/* {!userInfo && (
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            className='bg-white rounded-md h-12 w-20 justify-center items-center'
          >
            <Text className='text-black'>Sign In</Text>
          </TouchableOpacity>
        )}

        {!userInfo && (
          <TouchableOpacity
            onPress={() => navigation.navigate('SignUp')}
            className='bg-white rounded-md h-12 w-20 justify-center items-center'
          >
            <Text className='text-black'>Sign Up</Text>
          </TouchableOpacity>
        )} */}

        {/* {userInfo && (
          <TouchableOpacity
            onPress={() => handleLogout()}
            className='bg-white rounded-md h-12 w-20 justify-center items-center'
          >
            <Text className='text-black'>Log Out</Text>
          </TouchableOpacity>
        )} */}

        {/* {userInfo && (
          <TouchableOpacity
            onPress={() => navigation.navigate('BlankProfile')}
            className='bg-white rounded-md h-12 w-20 justify-center items-center'
          >
            <Text className='text-black'>Blank Profile</Text>
          </TouchableOpacity>
        )}

        {userInfo && (
          <TouchableOpacity
            onPress={() => navigation.navigate('UserProfile')}
            className='bg-white rounded-md h-12 w-20 justify-center items-center'
          >
            <Text className='text-black'>Filled Profile</Text>
          </TouchableOpacity>
        )} */}
      </Animatable.View>
    </SafeAreaView>
  )
}

export default InitialLoaderScreen
