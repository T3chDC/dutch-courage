import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { PlusIcon } from 'react-native-heroicons/solid'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { BACKEND_URL } from '../config'
import {
  getMeUser,
  updateMeUser,
  resetMeUser,
  resetMeUpdateUser,
} from '../features/user/userSlice'
import Toast from 'react-native-toast-message'
import * as Progress from 'react-native-progress'
import LocationPickerModal from '../components/LocationPickerModal'
import ImagePickerModal from '../components/ImagePickerModal'
import InterestPickerModal from '../components/InterestPickerModal'

const OwnProfileScreen = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()

  // Local State variables
  const [mantra, setMantra] = useState('')
  const [birthYear, setBirthYear] = useState('')
  const [gender, setGender] = useState('')
  const [location, setLocation] = useState('')
  const [topInterests, setTopInterests] = useState([])
  const [imageUrl, setImageUrl] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)

  // Modal State variables
  const [isImageChooseModalVisible, setIsImageChooseModalVisible] =
    useState(false)
  const [isInterestModalVisible, setIsInterestModalVisible] = useState(false)
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false)

  const { userInfo } = useSelector((state) => state.auth)

  const {
    meUser,
    isMeGetError,
    isMeGetSuccess,
    isMeGetLoading,
    meGetErrorMessage,
    isMeUpdateError,
    isMeUpdateSuccess,
    isMeUpdateLoading,
    meUpdateErrorMessage,
  } = useSelector((state) => state.user)

  useEffect(() => {
    if (!userInfo) {
      navigation.navigate('Login')
    }
  }, [userInfo, navigation])

  useEffect(() => {
    if (isMeGetError) {
      Toast.show({
        type: 'error',
        text1: meGetErrorMessage,
        visibilityTime: 3000,
      })
    } else if (isMeGetSuccess) {
      setMantra(meUser.mantra)
      setBirthYear(meUser.birthYear)
      setGender(meUser.gender)
      setLocation(meUser.location)
      setTopInterests(meUser.topInterests)
      setImageUrl(meUser.imageUrl)
    } else {
      dispatch(getMeUser())
    }
  }, [isMeGetError, isMeGetSuccess, meGetErrorMessage, dispatch, meUser])

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
        text1: 'Profile Updated Successfully',
        visibilityTime: 3000,
      })
      setEditMode(false)
      dispatch(getMeUser())
    }
  }, [isMeUpdateError, isMeUpdateSuccess, meUpdateErrorMessage, dispatch])

  useEffect(() => {
    return () => {
      dispatch(resetMeUser())
      dispatch(resetMeUpdateUser())
    }
  }, [dispatch])

  //Function to handle Image Upload
  const imageUploadHandler = async () => {
    const formData = new FormData()
    formData.append('image', {
      uri: selectedImage,
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

  // Function to update user profile
  const updateUserHandler = async () => {
    if (selectedImage) {
      imageUploadHandler().then((res) => {
        dispatch(
          updateMeUser({
            mantra,
            birthYear,
            gender,
            location,
            topInterests,
            imageUrl: res,
          })
        )
      })
    } else {
      dispatch(
        updateMeUser({
          mantra,
          birthYear,
          gender,
          location,
          topInterests,
        })
      )
    }
  }

  return (
    <View className='bg-black flex-1 justify-start items-center relative'>
      {/* background cutoff image*/}
      <Image
        source={require('../assets/projectImages/profileBackgroundCutOff.png')}
        className='w-[100vw] h-[40vh]'
      />
      {/* profile image and image picker */}
      <View className='mt-[-230] w-64 h-64 rounded-full bg-[#FCFCFE] flex-row justify-center items-center'>
        <TouchableOpacity
          onPress={() => setIsImageChooseModalVisible(true)}
          disabled={!editMode}
        >
          {imageUrl || selectedImage ? (
            <Image
              source={{ uri: selectedImage || imageUrl }}
              className='w-64 h-64 rounded-full'
            />
          ) : (
            <View className='flex justify-center items-center w-56 h-56'>
              <PlusIcon size={40} color={'black'} />
            </View>
          )}
        </TouchableOpacity>

        {/* image picker modal */}
        <ImagePickerModal
          isImageChooseModalVisible={isImageChooseModalVisible}
          setIsImageChooseModalVisible={setIsImageChooseModalVisible}
          setSelectedImage={setSelectedImage}
        />
      </View>
      {!isMeGetLoading && !isMeUpdateLoading && (
        <>
          {editMode ? (
            <>
              {/* mantra */}
              <View className='mt-5'>
                <TextInput
                  placeholder='Mantra'
                  keyboardType='email-address'
                  className='bg-[#F6F6F6] border border-[#E8E8E8] rounded-md h-12 w-80 px-4 mt-4'
                  value={mantra}
                  onChangeText={(text) => setMantra(text)}
                />
              </View>

              {/* birth year */}
              <View className='mt-2 bg-white h-12 w-36 rounded-md flex justify-center'>
                <Picker
                  selectedValue={birthYear?.toString()}
                  onValueChange={(itemValue, itemIndex) =>
                    setBirthYear(itemValue * 1)
                  }
                >
                  <Picker.Item
                    label='YYYY'
                    enabled={false}
                    value=''
                    color='#898A8D'
                  />
                  {[...Array(101).keys()]
                    .map((i) => 1950 + i)
                    .map((year) => (
                      <Picker.Item
                        key={year}
                        label={`${year}`}
                        value={`${year}`}
                      />
                    ))}
                </Picker>
              </View>

              {/* Gender */}
              <View className='mt-2 bg-white h-12 w-40 rounded-full flex justify-center'>
                <Picker
                  selectedValue={gender}
                  onValueChange={(itemValue, itemIndex) => setGender(itemValue)}
                >
                  <Picker.Item
                    label='Gender'
                    enabled={false}
                    value=''
                    color='#898A8D'
                  />
                  <Picker.Item label='Male' value='male' />
                  <Picker.Item label='Female' value='female' />
                  <Picker.Item label='Others' value='others' />
                </Picker>
              </View>

              {/* Location */}
              <View>
                <TouchableOpacity
                  className='bg-[#F6F6F6] border border-[#E8E8E8] flex rounded-full h-12 w-40 px-4 mt-4 flex-row justify-center items-center'
                  onPress={() => setIsLocationModalVisible(true)}
                >
                  <Text
                    className={
                      location
                        ? `text-black text-base font-medium`
                        : `text-[#898A8D] text-base font-medium`
                    }
                  >
                    {location ? location : 'Location'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Location picker modal */}
              <LocationPickerModal
                isLocationModalVisible={isLocationModalVisible}
                setIsLocationModalVisible={setIsLocationModalVisible}
                setLocation={setLocation}
              />

              {/* Top Interests */}
              <View>
                <TouchableOpacity
                  className='bg-[#F6F6F6] border border-[#E8E8E8] flex rounded-full h-12 w-80 px-4 mt-4 flex-row justify-center items-center'
                  onPress={() => setIsInterestModalVisible(true)}
                >
                  <Text
                    className={
                      topInterests && topInterests.length > 0
                        ? `text-black text-base font-medium`
                        : 'text-[#898A8D] text-base font-medium'
                    }
                  >
                    {topInterests && topInterests.length === 0
                      ? '3 Top Interests'
                      : `${topInterests[0]}, ${topInterests[1]}, ${topInterests[2]}`}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Interst picker modal */}
              <InterestPickerModal
                isInterestModalVisible={isInterestModalVisible}
                setIsInterestModalVisible={setIsInterestModalVisible}
                setTopInterests={setTopInterests}
              />
            </>
          ) : (
            <>
              {/* mantra */}
              <View className='mt-5'>
                <Text className='text-white text-base font-medium'>
                  {mantra}
                </Text>
              </View>

              {/* birth year */}
              <View className='mt-2'>
                <Text className='text-white text-base font-medium'>
                  {birthYear}
                </Text>
              </View>

              {/* Gender */}
              <View className='mt-2'>
                <Text className='text-white text-base font-medium'>
                  {gender}
                </Text>
              </View>

              {/* Location */}
              <View className='mt-2'>
                <Text className='text-white text-base font-medium'>
                  {location}
                </Text>
              </View>

              {/* Top Interests */}
              <View className='mt-2'>
                <Text className='text-white text-base font-medium'>
                  {topInterests &&
                    topInterests.length > 0 &&
                    `${topInterests[0]}, ${topInterests[1]}, ${topInterests[2]}`}
                </Text>
              </View>
            </>
          )}
        </>
      )}

      {/* edit profile button */}
      {!editMode ? (
        <>
          <View className='mt-4'>
            <TouchableOpacity
              className='bg-[#22A6B3] rounded-full h-12 w-40 flex-row justify-center items-center'
              onPress={() => setEditMode(true)}
            >
              <Text className='text-white text-base font-semibold'>
                Edit Profile
              </Text>
            </TouchableOpacity>
          </View>
          {isMeGetLoading && (
            <View className='mt-8'>
              <Progress.CircleSnail color='#22A6B3' size={60} />
            </View>
          )}
        </>
      ) : (
        <>
          <View className='mt-4'>
            <TouchableOpacity
              className='bg-[#22A6B3] rounded-full w-40 h-12 flex-row justify-center items-center'
              onPress={updateUserHandler}
            >
              <Text className='text-white text-base font-semibold'>Save</Text>
            </TouchableOpacity>
          </View>
          {isMeUpdateLoading && (
            <View className='mt-8'>
              <Progress.CircleSnail color='#22A6B3' size={60} />
            </View>
          )}
        </>
      )}
    </View>
  )
}

export default OwnProfileScreen
