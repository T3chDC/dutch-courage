import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect, useEffect } from 'react'
import { useRoute, useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Animatable from 'react-native-animatable'

const HomeScreen = () => {
  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [navigation])

  return (
    <SafeAreaView className='bg-black flex-1 justify-center items-center'>
      <Animatable.Image
        source={require('../assets/projectImages/TempLogo1.png')}
        animation='slideInDown'
        iterationCount={1}
        className='h-80 w-80'
      />
      <Animatable.View
        animation='slideInUp'
        iterationCount={1}
        className='flex-row justify-between w-60 mt-10'
      >
        <TouchableOpacity className='bg-white rounded-md h-12 w-20 justify-center items-center'>
          <Text className='text-black'>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity className='bg-white rounded-md h-12 w-20 justify-center items-center'>
          <Text className='text-black'>Sign Up</Text>
        </TouchableOpacity>
      </Animatable.View>
    </SafeAreaView>
  )
}

export default HomeScreen
