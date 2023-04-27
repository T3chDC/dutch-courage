import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  BackHandler,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'

const UserProfileEditScreen = () => {
  // Navigation hook
  const navigation = useNavigation()

  // Inform user that the changes made will be lost when back is pressed
  // useEffect(() => {
  //   const backAction = () => {
  //     Alert.alert(
  //       'Hold on!',
  //       'Are you sure you want to exit the edit profile screen? All changes will be lost.',
  //       [
  //         {
  //           text: 'Cancel',
  //           onPress: () => null,
  //           style: 'cancel',
  //         },
  //         { text: 'YES', onPress: () => navigation.goBack() },
  //       ],
  //       { cancelable: false }
  //     )
  //     return true
  //   }
  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     backAction
  //   )
  //   return () => backHandler.remove()
  // }, [])

  return (
    <View className='bg-black flex-1 justify-start items-center relative'>
      {/* background cutoff image*/}
      <Image
        source={require('../assets/projectImages/profileBackgroundCutOff.png')}
        className='w-[100vw] h-[40vh]'
      />
    </View>
  )
}

export default UserProfileEditScreen
