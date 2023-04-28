import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  BackHandler,
} from 'react-native'
import { ChevronLeftIcon, PlusIcon } from 'react-native-heroicons/solid'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { BACKEND_URL } from '../config'
import {
  updateMeUser,
  resetMeUser,
  resetMeUpdateUser,
} from '../features/user/userSlice'
import Toast from 'react-native-toast-message'
import { logout } from '../features/auth/authSlice'
import * as Progress from 'react-native-progress'
import LocationPickerModal from '../components/LocationPickerModal'
import ImagePickerModal from '../components/ImagePickerModal'
import InterestPickerModal from '../components/InterestPickerModal'
import GenderPickerModal from '../components/GenderPickerModal'
import AgeRangePickerModal from '../components/AgeRangePickerModal'

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
  const [userNameCount, setUserNameCount] = useState(meUser?.userName.length)
  const [mantra, setMantra] = useState(meUser?.mantra)
  const [ageRange, setAgeRange] = useState(meUser?.ageRange)
  const [gender, setGender] = useState(meUser?.gender)
  const [location, setLocation] = useState(meUser?.location)
  const [topInterests, setTopInterests] = useState(meUser?.topInterests)
  const [selectedProfileImage, setSelectedProfileImage] = useState(null)

  // Modal State variables
  // const [isImageChooseModalVisible, setIsImageChooseModalVisible] =
  //   useState(false)
  const [isInterestModalVisible, setIsInterestModalVisible] = useState(false)
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false)
  const [isGenderModalVisible, setIsGenderModalVisible] = useState(false)
  const [isAgeRangeModalVisible, setIsAgeRangeModalVisible] = useState(false)

  // Check if user is logged in
  useEffect(() => {
    if (!userInfo) {
      navigation.navigate('Login')
    }
  }, [userInfo, navigation])

  // Functionality when user is trying togo back to profile screen
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

  //Inform user that the changes made will be lost when back is pressed
  useEffect(() => {
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

  //Function to handle Image Upload
  const profileImageUploadHandler = async () => {
    const formData = new FormData()
    formData.append('image', {
      uri: selectedProfileImage,
      type: 'image/jpeg',
      name: 'image.jpg',
    })

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
      if (imageUrl) {
        const extractedFilePath = imageUrl.slice(imageUrl.lastIndexOf('/') + 1)
        if (extractedFilePath.startsWith('image')) {
          const res = await axios.post(
            BACKEND_URL + '/api/v1/upload/' + `${extractedFilePath}`,
            formData,
            config
          )
          return res.data
        } else {
          const res = await axios.post(
            BACKEND_URL + '/api/v1/upload',
            formData,
            config
          )
          return res.data
        }
      } else {
        const res = await axios.post(
          BACKEND_URL + '/api/v1/upload',
          formData,
          config
        )
        return res.data
      }
    } catch (error) {
      console.log(error)
    }
  }

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

      {isMeUpdateLoading ? (
        <Progress.CircleSnail
          color={['#F9A826', '#F9A826', '#F9A826']}
          size={100}
          thickness={5}
          className='mt-[-240] w-[100vw] flex-row justify-center items-center'
        />
      ) : (
        <>
          {/* Back Button */}
          <TouchableOpacity
            className='absolute top-10 left-4 flex-row items-center'
            onPress={() => backAction()}
          >
            <ChevronLeftIcon size={20} color='white' />
            <Text className='text-white text-base top-[-1]'>Back</Text>
          </TouchableOpacity>

          {/* profile image and image picker */}
          <View className='mt-[-200] mr-4 w-60 h-60 rounded-full bg-[#FCFCFE] flex-row justify-center items-center'>
            <TouchableOpacity
              onPress={() => setIsImageChooseModalVisible(true)}
            >
              {imageUrl || selectedProfileImage ? (
                <Image
                  source={{ uri: selectedProfileImage || imageUrl }}
                  className='w-56 h-56 rounded-full'
                />
              ) : (
                <View className='flex justify-center items-center w-56 h-56'>
                  <PlusIcon size={40} color={'black'} />
                </View>
              )}
            </TouchableOpacity>

            {/* image picker modal */}
            {/* <ImagePickerModal
              isImageChooseModalVisible={isImageChooseModalVisible}
              setIsImageChooseModalVisible={setIsImageChooseModalVisible}
              setSelectedImage={setSelectedImage}
            /> */}
          </View>

          {/* Vertical Images Thumbnails */}
          <View className='absolute h-56 top-10 right-[-10] flex justify-between items-center'>
            {images?.map((image, idx) => (
              <TouchableOpacity key={idx}>
                <View
                  key={idx}
                  className='w-12 h-12 rounded-full mx-5 bg-[#FCFCFE] flex-row justify-center items-center'
                >
                  <Image
                    source={{
                      uri: image,
                    }}
                    className='w-10 h-10 rounded-full'
                    resizeMode='cover'
                  />
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity>
              <View className='w-12 h-12 rounded-full mx-5 bg-[#FCFCFE] flex-row justify-center items-center'>
                <PlusIcon size={20} color={'black'} />
              </View>
            </TouchableOpacity>
            </View>
            {/* User Name label */}
          <View className='flex-row mt-5 justify-center items-center'>
            <Text className='text-[#898A8D] text-xs mr-48'>Imaginary Name</Text>
            <Text className='text-[#898A8D] text-xs'>{userNameCount}/35</Text>
          </View>

          {/* UserName */}
          <View>
            <TextInput
              placeholder='Username'
              keyboardType='default'
              className='bg-black w-80 h-10 flex-row justify-start items-center border-b-2 border-[#22A6B3] text-white text-lg font-bold px-1'
              value={userName}
              onChangeText={(text) => {
                if (text.length <= 35) {
                  setUserName(text)
                  setUserNameCount(text.length)
                }
              }}
            />
          </View>

          {/* User Age range label */}
          <View className='flex-row mt-5 justify-center items-center'>
            <Text className='text-[#898A8D] text-xs mr-64'>Age Range</Text>
          </View>

          {/* Age range */}
          <View>
            <TouchableOpacity onPress={() => setIsAgeRangeModalVisible(true)}>
              <TextInput
                placeholder='Age Range'
                keyboardType='default'
                className='bg-black w-80 h-10 flex-row justify-start items-center border-b-2 border-[#22A6B3] text-white text-sm px-1'
                value={ageRange}
                editable={false}
              />
            </TouchableOpacity>
          </View>

          {/* Age range picker modal */}
          <AgeRangePickerModal
            isAgeRangeModalVisible={isAgeRangeModalVisible}
            setIsAgeRangeModalVisible={setIsAgeRangeModalVisible}
            setAgeRange={setAgeRange}
          />
        </>
      )}
    </View>
  )
}

export default UserProfileEditScreen
