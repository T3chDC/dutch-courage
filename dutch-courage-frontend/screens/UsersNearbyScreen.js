import {
  View,
  Text,
  Image,
  TouchableOpacity,
  BackHandler,
  ScrollView,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import * as Progress from 'react-native-progress'
import SwipeButton from 'rn-swipe-button'
import Toast from 'react-native-toast-message'
import BlockModal from '../components/BlockModal'
import {
  getMeUser,
  resetMeUser,
  resetMeGetUser,
} from '../features/user/userSlice'
import {
  getLocation,
  addUser,
  resetOwnLocation,
  resetNearbyUsers,
} from '../features/location/locationSlice'
import RatingStars from '../components/RatingStars'
import { BACKEND_URL } from '../config'
import MapView, { Marker } from 'react-native-maps'

const UsersNearbyScreen = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()

  const { userInfo } = useSelector((state) => state.auth)
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
  } = useSelector((state) => state.location)

  const {
    meUser,
    isMeGetLoading,
    isMeGetSuccess,
    isMeGetError,
    meGetErrorMessage,
  } = useSelector((state) => state.user)

  //Local state variables
  const [imageUrl, setImageUrl] = useState('')
  const [userName, setUserName] = useState('')
  const [topInterests, setTopInterests] = useState([])
  const [rating, setRating] = useState(5)
  const [location, setLocation] = useState('')

  // const [report, setReport] = useState('')
  // const [reportCount, setReportCount] = useState(0)
  const [showBlockModal, setShowBlockModal] = useState(false)

  // User location related states
  const [userLocationRegion, setUserLocationRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })

  // Check if user is logged in
  useEffect(() => {
    if (!userInfo) {
      navigation.navigate('Login')
    }
  }, [userInfo, navigation])

  // Update location
  useEffect(() => {
    if (isLocationError) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: locationErrorMessage,
        visibilityTime: 3000,
      })
    } else if (isLocationSuccess) {
      setUserLocationRegion({
        latitude: ownLocation.coords.latitude,
        longitude: ownLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      })
    }
  }, [dispatch, ownLocation])

  // function to handle to go back
  useEffect(() => {
    const backAction = () => {
      navigation.goBack()
      return true
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    )

    return () => backHandler.remove()
  }, [navigation])

  //Get User Info
  useEffect(() => {
    if (isMeGetError) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: meGetErrorMessage,
        visibilityTime: 3000,
      })
    } else if (isMeGetSuccess) {
      setImageUrl(meUser.imageUrl)
      setUserName(meUser.userName)
      setTopInterests(meUser.topInterests)
      setRating(meUser.rating)
      setLocation(meUser.location)
    } else {
      dispatch(getMeUser())
    }
  }, [isMeGetError, isMeGetSuccess, meGetErrorMessage, dispatch])

  // Function to Update meUser state on modal close
  const updateMeUserBlockList = () => {
    dispatch(resetMeUser())
    dispatch(getMeUser())
    setShowBlockModal(false)
  }

  return (
    <View className='bg-black flex-1 justify-start items-center relative'>
      <TouchableOpacity
        className='absolute top-10 left-4'
        onPress={() => {
          navigation.goBack()
        }}
      >
        {/* <ChevronLeftIcon size={20} color='white' /> */}
        <Text className='text-white text-base top-[-1]'>{'< Back'}</Text>
      </TouchableOpacity>

      <View className='top-[8vh] justify-evenly items-center'>
        <View className='flex flex-row'>
          <MapView
            region={userLocationRegion}
            // onRegionChange={(region) => setUserLocationRegion(region)}
            style={{
              width: 400,
              height: 400,
            }}
          >
            <Marker
              coordinate={{
                latitude: ownLocation.coords.latitude,
                longitude: ownLocation.coords.longitude,
              }}
              pinColor='blue'
              title='You are here'
            ></Marker>
            {nearbyUsers.map((nearbyUser) => (
              <Marker
                key={nearbyUser._id}
                coordinate={{
                  latitude: nearbyUser.location.latitude,
                  longitude: nearbyUser.location.longitude,
                }}
                title={nearbyUser.userName}
              ></Marker>
            ))}
          </MapView>
        </View>

        <View className='flex flex-row justify-start mt-2'>
          <View className='flex flex-col w-[350]'>
            <Text className='text-white text-xl left-0'>Around You</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {nearbyUsers.length <= 0 ? (
            <Text className='text-white text-xl font-bold mt-5'>
              No Users Nearby
            </Text>
          ) : (
            <>
              {nearbyUsers.map(
                (nearbyUser) =>
                  // Check if nearby user is in the blockedUsers list of meUser
                  !meUser?.blockedUsers.includes(nearbyUser._id) &&
                  !meUser?.blockedByUsers.includes(nearbyUser._id) && (
                    <View
                      className='justify-start items-start w-[350] flex-row mt-4'
                      key={nearbyUser._id}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          if (
                            meUser?.blockedUsers.includes(nearbyUser._id) ||
                            meUser?.blockedByUsers.includes(nearbyUser._id)
                          ) {
                            return
                          }
                          navigation.navigate('OtherUserProfile', {
                            userId: nearbyUser._id,
                          })
                        }}
                      >
                        <Image
                          source={{
                            uri: `${BACKEND_URL}/uploads/${nearbyUser.imageUrl.slice(
                              nearbyUser.imageUrl.lastIndexOf('/') + 1
                            )}`,
                          }}
                          className='w-[50] h-[50] rounded-full'
                          resizeMode='cover'
                        />
                      </TouchableOpacity>

                      <View className='flex flex-row'>
                        <View className='flex flex-col w-[220]'>
                          <Text className='text-white text-xl left-5'>
                            {nearbyUser.userName}
                          </Text>

                          <Text className='mt-1 text-[#808080] text-muted left-5'>
                            {`${nearbyUser.topInterests[0]}, ${nearbyUser.topInterests[1]}, ${nearbyUser.topInterests[2]}`}
                          </Text>
                        </View>
                      </View>

                      <View className='right-[70px] flex flex-row'>
                        {/* Star */}
                        <Image
                          source={require('../assets/projectImages/starFull.png')}
                          className='w-6 h-6 mx-1'
                        />
                        <Text className='text-white text-xl'>
                          {nearbyUser.rating}
                        </Text>

                        {/* Block Button */}
                        <View className='bottom-[5] ml-2'>
                          <SwipeButton
                            title='Block'
                            titleColor='white'
                            titleFontSize={15}
                            swipeSuccessThreshold={50}
                            shouldResetAfterSuccess={true}
                            height={22}
                            width={80}
                            onSwipeSuccess={() =>
                              // Toast.show({
                              //   type: "success",
                              //   text1: "You have successfully blocked the user",
                              //   visibilityTime: 3000,
                              // })
                              setShowBlockModal(true)
                            }
                            thumbIconBackgroundColor='white'
                            thumbIconBorderColor='white'
                            railBackgroundColor='#FF7F50'
                            railBorderColor='#FF7F50'
                            railFillBackgroundColor='rgb(128, 128, 128)'
                            railFillBorderColor='#808080'
                          />
                        </View>

                        {/* Block Modal */}
                        <BlockModal
                          modalVisible={showBlockModal}
                          setModalVisible={updateMeUserBlockList}
                          // report={report}
                          // setReport={setReport}
                          userToBeBlocked={nearbyUser}
                          // reportCount={reportCount}
                          // setReportCount={setReportCount}
                        />
                      </View>
                    </View>
                  )
              )}
            </>
          )}
        </ScrollView>

        {/*  */}
      </View>
    </View>
  )
}

export default UsersNearbyScreen
