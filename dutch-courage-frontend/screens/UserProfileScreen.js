import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  BackHandler,
} from 'react-native'
import ToggleSwitch from '../components/ToggleSwitch'
import { UserIcon, ChatBubbleLeftRightIcon } from 'react-native-heroicons/solid'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import {
  getMeUser,
  resetMeUser,
  resetMeGetUser,
} from '../features/user/userSlice'
import {
  getLocation,
  addUser,
  removeUser,
  resetOwnLocation,
  resetNearbyUsers,
} from '../features/location/locationSlice'
import RatingStars from '../components/RatingStars'
import BottomDrawer from '../components/BottomDrawer'
import Toast from 'react-native-toast-message'
import * as Progress from 'react-native-progress'
// import SwipeButton from 'rn-swipe-button'
import { logout } from '../features/auth/authSlice'
import { BACKEND_URL } from '../config'

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
    isMeGetSuccess,
    isMeGetError,
    meGetErrorMessage,
  } = useSelector((state) => state.user)

  const {
    ownLocation,
    isLocationLoading,
    isLocationSuccess,
    isLocationError,
    locationErrorMessage,
    isUserLive,
    nearbyUsers,
    isNearbyUsersLoading,
    isNearbyUsersSuccess,
    isNearbyUsersError,
    nearbyUsersErrorMessage,
    isRemoveUserLoading,
    isRemoveUserSuccess,
    isRemoveUserError,
    removeUserErrorMessage,
  } = useSelector((state) => state.location)

  // Local State variables
  const [rating, setRating] = useState(5)
  const [imageUrl, setImageUrl] = useState('')
  const [galleryImage1Url, setGalleryImage1Url] = useState('')
  const [galleryImage2Url, setGalleryImage2Url] = useState('')
  const [galleryImage3Url, setGalleryImage3Url] = useState('')
  const [userName, setUserName] = useState('')
  const [mantra, setMantra] = useState('')
  const [ageRange, setAgeRange] = useState('')
  const [gender, setGender] = useState('')
  const [location, setLocation] = useState('')
  const [topInterests, setTopInterests] = useState([])
  const [isLive, setIsLive] = useState(false)
  const [nearbyUsersCount, setNearbyUsersCount] = useState(0)

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
  }, [userInfo, dispatch, navigation])

  // update user live status
  useEffect(() => {
    if (isUserLive) {
      setIsLive(true)
    } else {
      setIsLive(false)
    }
  }, [isUserLive])

  // Get user info
  useEffect(() => {
    if (isMeGetError) {
      Toast.show({
        type: 'error',
        text1: meGetErrorMessage,
        visibilityTime: 3000,
      })
    } else if (isMeGetSuccess) {
      setRating(meUser.rating)
      setImageUrl(meUser.imageUrl)
      setGalleryImage1Url(meUser.galleryImage1Url)
      setGalleryImage2Url(meUser.galleryImage2Url)
      setGalleryImage3Url(meUser.galleryImage3Url)
      setUserName(meUser.userName)
      setMantra(meUser.mantra)
      setAgeRange(meUser.ageRange)
      setGender(meUser.gender)
      setLocation(meUser.location)
      setTopInterests(meUser.topInterests)
    } else {
      dispatch(getMeUser())
    }
  }, [isMeGetError, isMeGetSuccess, meGetErrorMessage, dispatch])

  // Logout
  const handleLogout = () => {
    dispatch(logout())
    // dispatch(resetMeGetUser())
    dispatch(resetMeUser())
    navigation.navigate('Login')
  }

  // Function to handle going live
  const handleGoLive = () => {
    // If user location is already available do nothing
    if (ownLocation) {
      return
    }
    // Get user location
    dispatch(getLocation())
    Toast.show({
      type: 'success',
      text1: 'You are now live!',
      visibilityTime: 3000,
    })
  }

  // Function to handle going offline
  const handleGoOffline = () => {
    // Remove user from server
    dispatch(removeUser(userInfo._id))
  }

  // Look for remove user error
  useEffect(() => {
    if (isRemoveUserError) {
      Toast.show({
        type: 'error',
        text1: removeUserErrorMessage,
        visibilityTime: 3000,
      })
    } else if (isRemoveUserSuccess) {
      // Reset location state
      dispatch(resetOwnLocation())
      // Reset nearby users state
      dispatch(resetNearbyUsers())
      // Show toast
      Toast.show({
        type: 'success',
        text1: 'You are now Offline!',
        visibilityTime: 3000,
      })
    }
  }, [isRemoveUserError, isRemoveUserSuccess, removeUserErrorMessage, dispatch])

  // Add user to server on location success
  useEffect(() => {
    if (isLocationError) {
      Toast.show({
        type: 'error',
        text1: locationErrorMessage,
        visibilityTime: 3000,
      })
    } else if (isLocationSuccess) {
      // console.log('ownLocation', ownLocation)
      //Add user to server
      // dispatch(addUser(userInfo._id))
    }
  }, [ownLocation, dispatch])

  // Rerender on nearby users change
  useEffect(() => {
    if (isNearbyUsersError) {
      Toast.show({
        type: 'error',
        text1: nearbyUsersErrorMessage,
        visibilityTime: 3000,
      })
    } else if (isNearbyUsersSuccess) {
      // Check which nearby users are not blocked
      const filteredNearbyUsers = nearbyUsers.filter(
        (user) =>
          !meUser?.blockedUsers.includes(user._id) &&
          !meUser?.blockedByUsers.includes(user._id)
      )
      // Set nearby users count
      setNearbyUsersCount(filteredNearbyUsers.length)
    }
  }, [nearbyUsers, ownLocation, dispatch])

  // Reset user profile get status on unmount
  useEffect(() => {
    return () => {
      dispatch(resetMeGetUser())
    }
  }, [dispatch])

  return (
    <View className='bg-black flex-1 justify-start items-center relative'>
      {/* background cutoff image*/}
      <Image
        source={require('../assets/projectImages/profileBackgroundCutOff.png')}
        className='w-[100vw] h-[40vh]'
      />
      {isMeGetLoading ? (
        <Progress.CircleSnail
          color={['#22A6B3', '#22A6B3', '#22A6B3']}
          size={100}
          thickness={5}
          className='mt-[-240] w-[100vw] flex-row justify-center items-center'
        />
      ) : (
        <>
          {/* rating stars based on rating values */}
          <View className='mt-[-240] w-[100vw] flex-row justify-center items-center'>
            <RatingStars rating={rating} />
          </View>

          {/* profile image */}
          {imageUrl ? (
            <View className='mt-4 w-68 h-68 rounded-full bg-[#FCFCFE] flex-row justify-center items-center border-2 border-white'>
              <Image
                source={{
                  uri: `${BACKEND_URL}/uploads/${imageUrl.slice(
                    imageUrl.lastIndexOf('/') + 1
                  )}`,
                }}
                className='w-64 h-64 rounded-full'
                resizeMode='cover'
              />
            </View>
          ) : (
            <View className='mt-4 w-68 h-68 rounded-full bg-[#FCFCFE] flex-row justify-center items-center border-2 border-white'>
              <UserIcon
                name='user'
                size={64}
                color='gray'
                className='w-64 h-64 rounded-full'
              />
            </View>
          )}

          {/* Images */}
          {(galleryImage1Url || galleryImage2Url || galleryImage3Url) && (
            <View className='mt-4 w-[100vw] flex-row justify-center items-center'>
              {galleryImage1Url !== '' && (
                <View className='w-11 h-11 rounded-full mx-5 bg-[#FCFCFE] flex-row justify-center items-center'>
                  <Image
                    source={{
                      uri: `${BACKEND_URL}/uploads/${galleryImage1Url.slice(
                        galleryImage1Url.lastIndexOf('/') + 1
                      )}`,
                    }}
                    className='w-10 h-10 rounded-full'
                    resizeMode='cover'
                  />
                </View>
              )}

              {galleryImage2Url !== '' && (
                <View className='w-11 h-11 rounded-full mx-5 bg-[#FCFCFE] flex-row justify-center items-center'>
                  <Image
                    source={{
                      uri: `${BACKEND_URL}/uploads/${galleryImage2Url.slice(
                        galleryImage2Url.lastIndexOf('/') + 1
                      )}`,
                    }}
                    className='w-10 h-10 rounded-full'
                    resizeMode='cover'
                  />
                </View>
              )}

              {galleryImage3Url !== '' && (
                <View className='w-11 h-11 rounded-full mx-5 bg-[#FCFCFE] flex-row justify-center items-center'>
                  <Image
                    source={{
                      uri: `${BACKEND_URL}/uploads/${galleryImage3Url.slice(
                        galleryImage3Url.lastIndexOf('/') + 1
                      )}`,
                    }}
                    className='w-10 h-10 rounded-full'
                    resizeMode='cover'
                  />
                </View>
              )}
            </View>
          )}

          {/* User Name */}
          <View className='mt-4 w-[100vw] flex-row justify-center items-center'>
            <Text className='text-white text-3xl font-medium'>{userName}</Text>
          </View>

          {/* Mantra */}
          <View className='mt-1 w-[100vw] flex-row justify-center items-center'>
            <Text className='text-white text-xl font-medium'>{mantra}</Text>
          </View>

          {/* Age Range, gender and location */}
          <View className='mt-1 w-[100vw] flex-row justify-center items-center'>
            <Text className='text-white text-base font-normal'>
              {ageRange} {gender}, {location}
            </Text>
          </View>

          {/* Top Interests */}
          <View className='mt-1 w-[100vw] flex-row justify-center items-center'>
            <Text className='text-white text-base font-normal'>
              {topInterests.map((interest, idx) => (
                <Text key={idx} className='text-white text-base font-normal'>
                  {' '}
                  {idx < 2 ? `${interest}, ` : idx === 2 ? `${interest}` : ''}
                </Text>
              ))}
            </Text>
          </View>

          {/* Swipable Button */}
          <View className='mt-5 w-[100vw] flex-row justify-center items-center'>
            {/* Switch to go live or go offline */}
            <View className='flex-row justify-center items-center'>
              <ToggleSwitch
                text={{
                  on:
                    ownLocation && ownLocation.locationDescription.length > 17
                      ? `@${ownLocation.locationDescription
                          .split(',')[0]
                          .slice(0, 16)}...`
                      : ownLocation &&
                        ownLocation.locationDescription.length <= 17
                      ? `@${ownLocation.locationDescription.split(',')[0]}`
                      : 'Fetching Your Location...',
                  off: 'Go Live!',
                  activeTextColor: 'white',
                  inactiveTextColor: '#655A5A',
                }}
                textStyle={{
                  fontWeight: 'bold',
                  fontSize: 16,
                  marginLeft: isUserLive ? 0 : -58,
                  marginRight: isUserLive ? -50 : 0,
                }}
                color={{
                  indicator: isUserLive ? '#FFFFFF' : '#655A5A',
                  active: '#22A6B3',
                  inactive: '#D9D9D9',
                  activeBorder: '#41B4A4',
                  inactiveBorder: '#E9E9E9',
                }}
                active={isUserLive}
                disabled={false}
                width={200}
                radius={25}
                willBehaveLikeSwitch={false}
                onTouch={() => {
                  if (isUserLive) {
                    navigation.navigate('LocationFinder')
                  } else {
                    return
                  }
                }}
                onToggle={(isOn) => {
                  if (isOn) {
                    handleGoLive()
                  } else {
                    handleGoOffline()
                  }
                }}
              />
            </View>
          </View>

          {/* Logout button */}
          <View className='flex-row justify-center items-center mt-2'>
            <TouchableOpacity onPress={() => handleLogout()}>
              <View className='w-32 h-8 rounded-full bg-[#22A6B3] flex-row justify-center items-center'>
                <Text className='text-white text-lg font-bold'>Logout</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Other User Profile Visit Screen */}
          {/* <View className="flex-row justify-center items-center mt-2">
            <TouchableOpacity
              onPress={() => navigation.navigate("OtherUserProfile")}
            >
              <View className="w-32 h-8 rounded-full bg-[#22A6B3] flex-row justify-center items-center">
                <Text className="text-white text-lg font-bold">
                  Other Users Profile
                </Text>
              </View>
            </TouchableOpacity>
          </View> */}

          {/* Nearby Users */}
          {isUserLive && (
            <View className='mt-3'>
              <TouchableOpacity
                onPress={() => navigation.navigate('NearbyUsers')}
              >
                {nearbyUsersCount <= 0 ? (
                  <Text className='text-[#22A6B3] text-lg font-bold'>
                    No Users Nearby
                  </Text>
                ) : (
                  <Text className='text-[#22A6B3] text-lg font-bold'>
                    {nearbyUsersCount} Users Nearby
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Location Finder Screen */}
          {/* <View className='flex-row justify-center items-center mt-2'>
            <TouchableOpacity
              onPress={() => navigation.navigate('LocationFinder')}
            >
              <View className='w-32 h-8 rounded-full bg-[#22A6B3] flex-row justify-center items-center'>
                <Text className='text-white text-lg font-bold'>
                  Location Finder
                </Text>
              </View>
            </TouchableOpacity>
          </View> */}

          {/* Chat and User Profile Icons */}
          <BottomDrawer />
        </>
      )}
    </View>
  )
}

export default UserProfileScreen
