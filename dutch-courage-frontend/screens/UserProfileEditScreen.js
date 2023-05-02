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
  getMeUser,
  resetMeUser,
  resetMeUpdateUser,
} from '../features/user/userSlice'
import Toast from 'react-native-toast-message'
import { logout } from '../features/auth/authSlice'
import * as Progress from 'react-native-progress'
import LocationPickerModal from '../components/LocationPickerModal'
// import InterestPickerModal from '../components/InterestPickerModal'
// import GenderPickerModal from '../components/GenderPickerModal'
import AgeRangePickerModal from '../components/AgeRangePickerModal'
import MantraModal from '../components/MantraModal'
import ImagePickerModal from '../components/ImagePickerModal'
import ProfileImageViewerModal from '../components/ProfileImageViewerModal'
import GalleryImageViewerModal from '../components/GalleryImageViewerModal'

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
  const [mantraCount, setMantraCount] = useState(meUser?.mantra.length)
  const [ageRange, setAgeRange] = useState(meUser?.ageRange)
  const [gender, setGender] = useState(meUser?.gender)
  const [location, setLocation] = useState(meUser?.location)
  const [topInterests, setTopInterests] = useState(meUser?.topInterests)
  const [selectedProfileImage, setSelectedProfileImage] = useState(null)
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null)

  // Modal State variables
  const [isProfileImageModalVisible, setIsProfileImageModalVisible] =
    useState(false)
  const [isGalleryImageModalVisible, setIsGalleryImageModalVisible] =
    useState(false)
  const [isImagePickerModalVisible, setIsImagePickerModalVisible] =
    useState(false)
  // const [isInterestModalVisible, setIsInterestModalVisible] = useState(false)
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false)
  // const [isGenderModalVisible, setIsGenderModalVisible] = useState(false)
  const [isAgeRangeModalVisible, setIsAgeRangeModalVisible] = useState(false)
  const [isMantraModalVisible, setIsMantraModalVisible] = useState(false)

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
          text: 'Keep Editing',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'Cancel Changes',
          onPress: () => {
            navigation.goBack()
            dispatch(resetMeUpdateUser())
          },
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
          // navigation.goBack(),
        },
      ],
      { cancelable: false }
    )
    return true
  }

  //Inform user that the changes made will be lost when back is pressed
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () =>
      backAction()
    )
    return () => backHandler.remove()
  }, [
    userName,
    imageUrl,
    images,
    mantra,
    ageRange,
    gender,
    location,
    topInterests,
  ])

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
      dispatch(getMeUser())
      navigation.goBack()
    }
  }, [isMeUpdateError, isMeUpdateSuccess])

  //Function to handle profile Image Upload
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
    // dispatch(resetMeUpdateUser())
    dispatch(resetMeUser())
    navigation.navigate('Login')
  }

  // Reset user profile update status on unmount
  useEffect(() => {
    return () => {
      // console.log('UserProfileEditScreen unmounted')
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
          color={['#22A6B3', '#22A6B3', '#22A6B3']}
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
            {/* <ChevronLeftIcon size={20} color='white' /> */}
            <Text className='text-white text-base top-[-1]'>{'< Back'}</Text>
          </TouchableOpacity>

          {/* profile image and image picker */}
          <View className='mt-[-200] mr-4 w-60 h-60 rounded-full bg-[#FCFCFE] flex-row justify-center items-center'>
            <TouchableOpacity
              onPress={() => setIsProfileImageModalVisible(true)}
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

            {/* Profile image modal */}
            <ProfileImageViewerModal
              isProfileImageModalVisible={isProfileImageModalVisible}
              setIsProfileImageModalVisible={setIsProfileImageModalVisible}
              selectedProfileImage={selectedProfileImage}
              setSelectedProfileImage={setSelectedProfileImage}
              imageUrl={imageUrl}
            />
          </View>

          {/* Vertical Images Thumbnails */}
          <View className='absolute h-56 top-10 right-[-10] flex justify-between items-center'>
            {images?.map((image, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => {
                  setIsGalleryImageModalVisible(true)
                }}
              >
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

            {/* Gallery image viewer modal */}
            <GalleryImageViewerModal
              isGalleryImageModalVisible={isGalleryImageModalVisible}
              setIsGalleryImageModalVisible={setIsGalleryImageModalVisible}
              images={images}
              setImages={setImages}
              setSelectedProfileImage={setSelectedProfileImage}
            />

              <TouchableOpacity
                onPress={() => {
                  if (images.length < 3) {
                    setIsImagePickerModalVisible(true)
                  } else {
                    Toast.show({
                      type: 'error',
                      text1: 'Maximum 3 images allowed apart from profile picture',
                      visibilityTime: 3000,
                    })
                  }
                }}
              >
              <View className='w-12 h-12 rounded-full mx-5 bg-[#FCFCFE] flex-row justify-center items-center'>
                <PlusIcon size={20} color={'black'} />
              </View>
            </TouchableOpacity>

            {/* Image Picker Modal */}
            <ImagePickerModal
              isImageChooseModalVisible={isImagePickerModalVisible}
              setIsImageChooseModalVisible={setIsImagePickerModalVisible}
              setSelectedImage={setSelectedGalleryImage}
              images={images}
              setImages={setImages}
            />
          </View>

          {/* User Name label */}
          <View className='flex-row mt-3 justify-center items-center mb-[-5] z-10'>
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

          {/* Age range label */}
          <View className='flex-row mt-3 justify-center items-center mb-[-5] z-10'>
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

          {/* Gender label */}
          <View className='flex-row mt-3 justify-center items-center mb-[-5] z-10'>
            <Text className='text-[#898A8D] text-xs mr-[275]'>Gender</Text>
          </View>

          {/* Gender */}
          <View>
            {/* <TouchableOpacity onPress={() => setIsGenderModalVisible(true)}> */}
            <TextInput
              placeholder='Gender'
              keyboardType='default'
              className='bg-black w-80 h-10 flex-row justify-start items-center border-b-2 border-[#22A6B3] text-white text-sm px-1'
              value={gender}
              editable={false}
            />
            {/* </TouchableOpacity> */}
          </View>

          {/* Gender picker modal */}
          {/* <GenderPickerModal
            isGenderModalVisible={isGenderModalVisible}
            setIsGenderModalVisible={setIsGenderModalVisible}
            setGender={setGender}
          /> */}

          {/* Location label */}
          <View className='flex-row mt-3 justify-center items-center mb-[-5] z-10'>
            <Text className='text-[#898A8D] text-xs mr-[265]'>Location</Text>
          </View>

          {/* Location */}
          <View>
            <TouchableOpacity onPress={() => setIsLocationModalVisible(true)}>
              <TextInput
                placeholder='Location'
                keyboardType='default'
                className='bg-black w-80 h-10 flex-row justify-start items-center border-b-2 border-[#22A6B3] text-white text-sm px-1'
                value={location}
                editable={false}
              />
            </TouchableOpacity>
          </View>

          {/* Location picker modal */}
          <LocationPickerModal
            isLocationModalVisible={isLocationModalVisible}
            setIsLocationModalVisible={setIsLocationModalVisible}
            setLocation={setLocation}
          />

          {/* Mantra label */}
          <View className='flex-row mt-3 justify-center items-center mb-[-5] z-10'>
            <Text className='text-[#898A8D] text-xs mr-56'>Your Mantra</Text>
            <Text className='text-[#898A8D] text-xs'>{mantraCount}/40</Text>
          </View>

          {/* Mantra */}
          <View>
            <TouchableOpacity onPress={() => setIsMantraModalVisible(true)}>
              <TextInput
                placeholder='Mantra'
                keyboardType='default'
                className='bg-black w-80 h-10 flex-row justify-start items-center border-b-2 border-[#22A6B3] text-white text-sm px-1'
                value={mantra}
                editable={false}
              />
            </TouchableOpacity>
          </View>

          {/* Mantra instructions */}
          <View className='flex-row justify-center items-center mb-[-5] z-10'>
            <Text className='text-[#898A8D] text-xs text-center'>
              {
                '(Keep it simple. No social media accounts, other app details, no phone numbers or any solicitation)'
              }
            </Text>
          </View>

          {/* Mantra modifier modal */}
          <MantraModal
            isMantraModalVisible={isMantraModalVisible}
            setIsMantraModalVisible={setIsMantraModalVisible}
            mantra={mantra}
            mantraCount={mantraCount}
            setMantra={setMantra}
            setMantraCount={setMantraCount}
          />

          {/* Logout button */}
          <View className='flex-row justify-center items-center mt-2'>
            <TouchableOpacity onPress={() => handleLogout()}>
              <View className='w-32 h-8 rounded-full bg-[#22A6B3] flex-row justify-center items-center'>
                <Text className='text-white text-lg font-bold'>Logout</Text>
              </View>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  )
}

export default UserProfileEditScreen
