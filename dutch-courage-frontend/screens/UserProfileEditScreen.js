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
import { useDispatch, useSelector } from 'react-redux'
import {
  updateMeUser,
  resetMeUser,
  resetMeUpdateUser,
} from '../features/user/userSlice'
import Toast from 'react-native-toast-message'
import { logout } from '../features/auth/authSlice'

const UserProfileEditScreen = () => {
  // Navigation hook
  const navigation = useNavigation()
  // Redux Dispatch hook
  const dispatch = useDispatch()

  // Redux State variables
  const { userInfo } = useSelector((state) => state.auth)
  const {
    meUser,
    isMeUpdateLoading,
    isMeUpdateSuccess,
    isMeUpdateError,
    meUpdateErrorMessage,
  } = useSelector((state) => state.user)

  // Local State variables
  const [imageUrl, setImageUrl] = useState(meUser?.imageUrl)
  const [images, setImages] = useState(meUser?.images)
  const [userName, setUserName] = useState(meUser?.userName)
  const [mantra, setMantra] = useState(meUser?.mantra)
  const [ageRange, setAgeRange] = useState(meUser?.ageRange)
  const [gender, setGender] = useState(meUser?.gender)
  const [location, setLocation] = useState(meUser?.location)
  const [topInterests, setTopInterests] = useState(meUser?.topInterests)

  // Check if user is logged in
  useEffect(() => {
    if (!userInfo) {
      navigation.navigate('Login')
    }
  }, [userInfo, navigation])

  //Inform user that the changes made will be lost when back is pressed
  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        'Hold on!',
        'The changes you made will be automatically saved when you leave this screen. Are you sure you want to exit the profile editing screen?',
        [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {
            text: 'YES',
            onPress: () =>
              dispatch(
                updateMeUser({
                  userName,
                  imageUrl,
                  images,
                  mantra,
                  ageRange,
                  gender,
                  location,
                  topInterests,
                })
              ),
          },
        ],
        { cancelable: false }
      )
      return true
    }
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    )
    return () => backHandler.remove()
  }, [])

  // Update user profile
  useEffect(() => {
    if (isMeUpdateError) {
      Toast.show({
        type: 'error',
        text1: meUpdateErrorMessage,
        visibilityTime: 3000,
      })
    } else if (isMeUpdateSuccess) {
      Toast.show({
        type: 'success',
        text1: 'Profile information updated successfully',
        visibilityTime: 3000,
      })
      navigation.goBack()
    }
  }, [isMeUpdateError, isMeUpdateSuccess])

  // Logout
  const handleLogout = () => {
    dispatch(logout())
    dispatch(resetMeUpdateUser())
    dispatch(resetMeUser())
    navigation.navigate('Login')
  }

  // Reset user profile update status on unmount
  useEffect(() => {
    return () => {
      console.log('UserProfileEditScreen unmounted')
      dispatch(resetMeUpdateUser())
    }
  }, [dispatch])

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
