import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  BackHandler,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
} from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { useNavigation } from '@react-navigation/native'
import { MagnifyingGlassIcon } from 'react-native-heroicons/solid'
import { useDispatch, useSelector } from 'react-redux'
import * as Progress from 'react-native-progress'
import Toast from 'react-native-toast-message'
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
import axios from 'axios'
import { BACKEND_URL, GOOGLE_API_KEY } from '../config'
import MapView, { Marker } from 'react-native-maps'

const LocationFinderScreen = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()

  const scrollViewRef = useRef(null)

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

  // const {
  //   meUser,
  //   isMeGetLoading,
  //   isMeGetSuccess,
  //   isMeGetError,
  //   meGetErrorMessage,
  // } = useSelector((state) => state.user)

  //Local state variables
  const [searchText, setSearchText] = useState('')
  const [nearbyLocations, setNearbyLocations] = useState([])

  // Check if user is logged in
  useEffect(() => {
    if (!userInfo) {
      navigation.navigate('Login')
    }
  }, [userInfo, navigation])

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

  // Scroll to bottom of the screen when keyboard is open
  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => {
      // Scroll to top of the screen
      scrollViewRef.current.scrollTo({ x: 0, y: 400, animated: true })
    })

    // cleanup function
    return () => {
      Keyboard.removeAllListeners('keyboardDidShow')
    }
  }, [])

  // scroll to top of the screen when keyboard is closed
  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', () => {
      // Scroll to top of the screen
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true })
    })

    // cleanup function
    return () => {
      Keyboard.removeAllListeners('keyboardDidHide')
    }
  }, [])

  // update nearbylocation using google places api
  useEffect(() => {
    if (ownLocation) {
      const initialKeyword = 'restaurant, food, cafe, bar, point_of_interest'
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${ownLocation.coords.latitude},${ownLocation.coords.longitude}&radius=200&keyword=${initialKeyword}&key=${GOOGLE_API_KEY}`
      axios
        .get(url)
        .then((res) => {
          setNearbyLocations(res.data.results)
        })
        .catch((err) => {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Could not fetch nearby locations',
          })
          console.log(err)
        })
    }
  }, [ownLocation])

  // change nearbylocation based on search text
  useEffect(() => {
    if (searchText) {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${ownLocation.coords.latitude},${ownLocation.coords.longitude}&radius=200&keyword=${searchText}&key=${GOOGLE_API_KEY}`
      axios
        .get(url)
        .then((res) => {
          setNearbyLocations(res.data.results)
        })
        .catch((err) => {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Could not fetch nearby locations',
          })
          console.log(err)
        })
    } else {
      const initialKeyword = 'restaurant, food, cafe, bar, point_of_interest'
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${ownLocation.coords.latitude},${ownLocation.coords.longitude}&radius=200&keyword=${initialKeyword}&key=${GOOGLE_API_KEY}`
      axios
        .get(url)
        .then((res) => {
          setNearbyLocations(res.data.results)
        })
        .catch((err) => {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Could not fetch nearby locations',
          })
          console.log(err)
        })
    }
  }, [searchText])

  return (
    <View className='bg-black flex-1 justify-start items-center relative'>
      <TouchableOpacity
        className='absolute top-10 left-4'
        onPress={() => {
          navigation.goBack()
        }}
      >
        <Text className='text-white text-base top-[-1]'>{'< Back'}</Text>
      </TouchableOpacity>

      <View className='top-[8vh] justify-evenly items-center '>
        {/* <View className="flex flex-row">
          <MapView
            initialRegion={{
              latitude: 23.7941139,
              longitude: 90.4038988,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            style={{
              width: 400,
              height: 450,
            }}
          >
            <Marker
              coordinate={{ latitude: 23.7941139, longitude: 90.4038988 }}
            ></Marker>
          </MapView>
        </View> */}

        <KeyboardAvoidingView
          behavior={'height'}
          className='flex-1 flex-col justify-end items-center w-100 h-[650] '
        >
          <ScrollView
            // className='flex flex-col justify-end items-center w-80'
            contentContainerStyle={{
              flexGrow: 1,
              minHeight: 1000,
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}
            ref={scrollViewRef}
            // onContentSizeChange={() => {
            //   if (nearbyLocations.length <= 3) {
            //     scrollViewRef.current.scrollTo({ x: 0, y: 200, animated: true })
            //   }
            // }}
          >
            <View className='flex flex-row'>
              <MapView
                region={{
                  latitude: ownLocation.coords.latitude,
                  longitude: ownLocation.coords.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
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
                >
                  <View
                    style={{
                      height: 50,
                      width: 50,
                      borderRadius: 25,
                      borderWidth: 3,
                      borderColor: 'blue',
                      overflow: 'hidden',
                    }}
                  >
                    <Image
                      source={{
                        uri: `${BACKEND_URL}/uploads/${userInfo.imageUrl.slice(
                          userInfo.imageUrl.lastIndexOf('/') + 1
                        )}`,
                      }}
                      style={{
                        height: 50,
                        width: 50,
                      }}
                    />
                  </View>
                </Marker>
              </MapView>
            </View>

            <View className='mt-5'>
              <Text className='text-white text-sm font-bold left-[10vw]'>
                Search Your Location
              </Text>

              {/* Search Location Text Field */}
              <View className='left-[10vw]'>
                <TextInput
                  placeholder='&nbsp; Find Me'
                  placeholderTextColor='#808080'
                  keyboardType='default'
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.nativeEvent.text)
                  }}
                  className='text-white text-base w-[320] h-10 flex-row mt-5 border-2 rounded-xl border-[#22A6B3] px-10'
                />
                <TouchableOpacity className='bottom-8 left-2 w-[20]'>
                  <MagnifyingGlassIcon color='#22A6B3' />
                </TouchableOpacity>
              </View>

              {/* Locations */}
              <View className=''>
                {nearbyLocations.map((location, idx) => (
                  <>
                    <View key={idx} className='left-[15vw] mt-5'>
                      <Text className='text-white text-base font-bold'>
                        {location.name}
                      </Text>
                      <Text className='text-white text-sm'>
                        {location.vicinity}
                      </Text>
                    </View>
                    <View className='flex flex-row left-12 mt-[15] h-[1] w-[400] bg-[#22A6B3]'></View>
                  </>
                ))}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  )
}

export default LocationFinderScreen
