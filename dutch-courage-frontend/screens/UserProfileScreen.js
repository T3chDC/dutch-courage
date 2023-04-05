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
import { getMeUser, resetMeUser } from '../features/user/userSlice'
import RatingStars from '../components/RatingStars'
import Toast from 'react-native-toast-message'
import * as Progress from 'react-native-progress'
import { logout } from '../features/auth/authSlice'

const UserProfileScreen = () => {
  // Navigation hook
  const navigation = useNavigation()
  // Redux Dispatch hook
  const dispatch = useDispatch()

  // Redux State variables
  const { userInfo } = useSelector((state) => state.auth)
  const {
    meUser,
    isMeGetLoading,
    ismeGetSuccess,
    isMeGetError,
    meGetErrorMessage,
  } = useSelector((state) => state.user)

  // Local State variables
  const [rating, setRating] = useState(5)
  const [imageUrl, setImageUrl] = useState('')
  const [images, setImages] = useState([])
  const [userName, setUserName] = useState('')
  const [mantra, setMantra] = useState('')
  const [ageRange, setAgeRange] = useState('')
  const [gender, setGender] = useState('')
  const [location, setLocation] = useState('')
  const [topInterests, setTopInterests] = useState([])

  // Check if user is logged in
  useEffect(() => {
    if (!userInfo) {
      navigation.navigate('Login')
    }
  }, [userInfo, navigation])

  //Exit App on Back Press
  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        'Hold on!',
        'Are you sure you want to exit the app?',
        [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          { text: 'YES', onPress: () => BackHandler.exitApp() },
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

  // Get user info
  useEffect(() => {
    if (isMeGetError) {
      Toast.show({
        type: 'error',
        text1: meGetErrorMessage,
        visibilityTime: 3000,
      })
    } else if (ismeGetSuccess) {
      setRating(meUser.rating)
      setImageUrl(meUser.imageUrl)
      setImages(meUser.images)
      setUserName(meUser.userName)
      setMantra(meUser.mantra)
      setAgeRange(meUser.ageRange)
      setGender(meUser.gender)
      setLocation(meUser.location)
      setTopInterests(meUser.topInterests)
    } else {
      dispatch(getMeUser())
    }
  }, [isMeGetError, ismeGetSuccess, meGetErrorMessage, meUser, dispatch])

  // Logout
  const handleLogout = () => {
    dispatch(logout())
    dispatch(resetMeUser())
    navigation.navigate('Login')
  }

  // Reset user profile update status on unmount
  useEffect(() => {
    return () => {
      dispatch(resetMeUser())
    }
  }, [dispatch])

  return (
    <View className='bg-black flex-1 justify-start items-center relative'>
      {/* background cutoff image*/}
      <Image
        source={require('../assets/projectImages/profileBackgroundCutOff.png')}
        className='w-[100vw] h-[40vh]'
      />
      {/* rating stars based on rating values */}
      <View className='mt-[-240] w-[100vw] flex-row justify-center items-center'>
        <RatingStars rating={rating} />
      </View>

      {/* profile image */}
      <View className='mt-4 w-64 h-64 rounded-full bg-[#FCFCFE] flex-row justify-center items-center'>
        <Image
          source={{ uri: imageUrl }}
          className='w-64 h-64 rounded-full'
          resizeMode='cover'
        />
      </View>
    </View>
  )
}

export default UserProfileScreen
