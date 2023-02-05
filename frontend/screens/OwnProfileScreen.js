import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRoute, useNavigation } from '@react-navigation/native'

const OwnProfileScreen = () => {
  const navigation = useNavigation()

  return (
    <View className='bg-black flex-1 justify-start items-center'>
      {/* background cutoff image*/}
      <Image
        source={require('../assets/projectImages/profileBackgroundCutOff.png')}
      />
    </View>
  )
}

export default OwnProfileScreen
