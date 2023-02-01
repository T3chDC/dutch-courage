import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect, useEffect } from 'react'
import { useRoute, useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'

const HomeScreen = () => {
  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [navigation])

  return (
    <SafeAreaView>
      <View className='bg-black h-[100vh]'>
        <Text className='text-white'>HomeScreen</Text>
      </View>
    </SafeAreaView>
  )
}

export default HomeScreen
