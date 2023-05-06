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
import InterestPickerModal from '../components/InterestPickerModal'
import ImagePickerModal from '../components/ImagePickerModal'
import ProfileImageViewerModal from '../components/ProfileImageViewerModal'
import GalleryImageViewerModal from '../components/GalleryImageViewerModal'
import interests from '../assets/staticData/interests'

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
  const [galleryImage1Url, setGalleryImage1Url] = useState(
    meUser?.galleryImage1Url
  )
  const [galleryImage2Url, setGalleryImage2Url] = useState(
    meUser?.galleryImage2Url
  )
  const [galleryImage3Url, setGalleryImage3Url] = useState(
    meUser?.galleryImage3Url
  )
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
  const [isInterestModalVisible, setIsInterestModalVisible] = useState(false)
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
          onPress: async () => updateUserHandler(),
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
    mantra,
    ageRange,
    gender,
    location,
    topInterests,
    selectedProfileImage,
    selectedGalleryImage,
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

  // Functin to update user information
  const updateUserHandler = async () => {
    if (selectedProfileImage) {
      profileImageUploadHandler().then((res) => {
        const updatedUser = {
          userName,
          imageUrl: res,
          mantra,
          ageRange,
          gender,
          location,
          topInterests,
        }
        dispatch(updateMeUser(updatedUser))
      })
    }
    // if (selectedGalleryImage) {
    //   galleryImageUploadHandler().then((res) => {
    //     const updatedUser = {
    //       userName,
    //       images: res,
    //       mantra,
    //       ageRange,
    //       gender,
    //       location,
    //       topInterests,
    //     }
    //     dispatch(updateMeUser(updatedUser))
    //   })
    // }
    else {
      const updatedUser = {
        userName,
        mantra,
        ageRange,
        gender,
        location,
        topInterests,
      }
      dispatch(updateMeUser(updatedUser))
    }
  }

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

  // //Function to handle gallery Image Upload
  // const galleryImageUploadHandler = async () => {
  //   let uploadedImages = []
  //   images.forEach(async (image) => {
  //     const formData = new FormData()
  //     formData.append('image', {
  //       uri: image,
  //       type: 'image/jpeg',
  //       name: 'image.jpg',
  //     })

  //     try {
  //       const config = {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //         },
  //       }
  //       if (image) {
  //         const extractedFilePath = image.slice(image.lastIndexOf('/') + 1)
  //         if (extractedFilePath.startsWith('image')) {
  //           const res = await axios.post(
  //             BACKEND_URL + '/api/v1/upload/' + `${extractedFilePath}`,
  //             formData,
  //             config
  //           )
  //           uploadedImages.push(res.data)
  //         } else {
  //           const res = await axios.post(
  //             BACKEND_URL + '/api/v1/upload',
  //             formData,
  //             config
  //           )
  //           uploadedImages.push(res.data)
  //         }
  //       } else {
  //         const res = await axios.post(
  //           BACKEND_URL + '/api/v1/upload',
  //           formData,
  //           config
  //         )
  //         uploadedImages.push(res.data)
  //       }
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   })
  //   return uploadedImages
  // }

  // Logout
  // const handleLogout = () => {
  //   dispatch(logout())
  //   // dispatch(resetMeUpdateUser())
  //   dispatch(resetMeUser())
  //   navigation.navigate('Login')
  // }

  // Reset user profile update status on unmount
  useEffect(() => {
    return () => {
      // console.log('UserProfileEditScreen unmounted')
      dispatch(resetMeUpdateUser())
    }
  }, [dispatch])

  // console.log('Initial images', initialImages)
  // console.log('Images', images)
  // console.log('imageUrl', imageUrl)
  // console.log('Selected Profile Image', selectedProfileImage)

  return (
    <View className='bg-black flex-1 justify-start items-center relative'>
      {/* background cutoff image*/}
      <Image
        source={require('../assets/projectImages/profileBackgroundCutOff.png')}
        className='w-[100vw] h-[40vh]'
      />

      {isMeUpdateLoading ? (
        <>
          <View className='flex-1 justify-center items-center'>
            <Text className='text-[#22A6B3] text-2xl font-bold mb-4'>
              Updating Profile...
            </Text>
            <Progress.CircleSnail
              color={['#22A6B3', '#22A6B3', '#22A6B3']}
              size={100}
              thickness={5}
              className='w-[100vw] flex-row justify-center items-center'
            />
          </View>
        </>
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
          <View className='mt-[-230] mr-4 w-60 h-60 rounded-full bg-[#FCFCFE] flex-row justify-center items-center'>
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
          <View className='absolute h-56 top-10 right-[-10] flex justify-start items-center'>
            {galleryImage1Url && (
              <TouchableOpacity
                onPress={() => {
                  setIsGalleryImageModalVisible(true)
                }}
                className='mb-2'
              >
                <View className='w-12 h-12 rounded-full mx-5 bg-[#FCFCFE] flex-row justify-center items-center'>
                  <Image
                    source={{
                      uri: galleryImage1Url,
                    }}
                    className='w-10 h-10 rounded-full'
                    resizeMode='cover'
                  />
                </View>
              </TouchableOpacity>
            )}

            {galleryImage2Url && (
              <TouchableOpacity
                onPress={() => {
                  setIsGalleryImageModalVisible(true)
                }}
                className='mb-2'
              >
                <View className='w-12 h-12 rounded-full mx-5 bg-[#FCFCFE] flex-row justify-center items-center'>
                  <Image
                    source={{
                      uri: galleryImage2Url,
                    }}
                    className='w-10 h-10 rounded-full'
                    resizeMode='cover'
                  />
                </View>
              </TouchableOpacity>
            )}

            {galleryImage3Url && (
              <TouchableOpacity
                onPress={() => {
                  setIsGalleryImageModalVisible(true)
                }}
                className='mb-2'
              >
                <View className='w-12 h-12 rounded-full mx-5 bg-[#FCFCFE] flex-row justify-center items-center'>
                  <Image
                    source={{
                      uri: galleryImage3Url,
                    }}
                    className='w-10 h-10 rounded-full'
                    resizeMode='cover'
                  />
                </View>
              </TouchableOpacity>
            )}

            {/* Gallery image viewer modal */}
            {/* <GalleryImageViewerModal
              isGalleryImageModalVisible={isGalleryImageModalVisible}
              setIsGalleryImageModalVisible={setIsGalleryImageModalVisible}
              images={images}
              setImages={setImages}
              setSelectedProfileImage={setSelectedProfileImage}
            /> */}

            <TouchableOpacity
              onPress={() => {
                if (!galleryImage3Url) {
                  setIsImagePickerModalVisible(true)
                } else {
                  Toast.show({
                    type: 'error',
                    text1:
                      'Maximum 3 images allowed apart from profile picture',
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
              // images={images}
              // setImages={setImages}
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

          {/* Interests label */}
          <View className='flex-row mt-3 justify-center items-center mb-[-5] z-10'>
            <Text className='text-[#898A8D] text-xs mr-[270]'>Interests</Text>
          </View>

          {/* Interests */}
          <View>
            <TouchableOpacity onPress={() => setIsInterestModalVisible(true)}>
              <TextInput
                placeholder='Interests'
                keyboardType='default'
                className='bg-black w-80 h-10 flex-row justify-start items-center border-b-2 border-[#22A6B3] text-white text-sm px-1'
                value={`${topInterests[0]}, ${topInterests[1]}, ${topInterests[2]}`}
                editable={false}
              />
            </TouchableOpacity>
          </View>

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
        </>
      )}
    </View>
  )
}

export default UserProfileEditScreen
