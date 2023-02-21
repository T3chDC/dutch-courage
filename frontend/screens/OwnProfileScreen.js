import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native'
import { Picker } from '@react-native-picker/picker'
import * as ImagePicker from 'expo-image-picker'
import { PlusIcon } from 'react-native-heroicons/solid'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRoute, useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import {
  getMeUser,
  updateMeUser,
  resetMeUser,
  resetMeUpdateUser,
} from '../features/user/userSlice'
import Toast from 'react-native-toast-message'

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
  const [isImageChooseModalVisible, setIsImageChooseModalVisible] =
    useState(false)

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
      navigation.navigate('/login')
    }
  }, [userInfo, navigation])

  useEffect(() => {
    if (isMeGetError) {
      Toast.show({
        type: 'error',
        text1: meGetErrorMessage,
        visibilityTime: 3000,
        position: 'bottom',
      })
      dispatch(resetMeUser())
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

  // Function to pick image from gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    })

    console.log(result)

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri)
      setIsImageChooseModalVisible(false)
    }
  }

  // Function to take image from camera
  const takeImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    })

    console.log(result)

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri)
      setIsImageChooseModalVisible(false)
    }
  }

  // Function to open modal to choose between camera and gallery
  const openModal = () => {
    setIsImageChooseModalVisible(true)
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
        <TouchableOpacity onPress={() => openModal()}>
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
        <Modal
          animationType='slide'
          transparent={true}
          visible={isImageChooseModalVisible}
          onRequestClose={() => {
            setIsImageChooseModalVisible(false)
          }}
        >
          <View className='absolute bottom-0 flex-1 justify-center items-center'>
            <View className='w-[100vw] h-[200] rounded-2xl flex-col justify-between items-center py-5 bg-gray-800'>
              <TouchableOpacity
                className='bg-[#22A6B3] rounded-full w-40 h-12 flex-row justify-center items-center'
                onPress={() => takeImage()}
              >
                <Text className='text-white text-base font-semibold'>
                  Take Photo
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className='bg-[#22A6B3] rounded-full w-40 h-12 flex-row justify-center items-center'
                onPress={() => pickImage()}
              >
                <Text className='text-white text-base font-semibold'>
                  Choose from Gallery
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className='bg-[#22A6B3] rounded-full w-40 h-12 flex-row justify-center items-center'
                onPress={() => setIsImageChooseModalVisible(false)}
              >
                <Text className='text-white text-base font-semibold'>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

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
          <View className='mt-2 bg-white h-12 w-28 rounded-md pl-2 flex justify-center'>
            <Picker
              selectedValue={birthYear}
              onValueChange={(itemValue, itemIndex) => setBirthYear(itemValue)}
            >
              <Picker.Item label='YYYY' value='' color='#898A8D' />
              {[...Array(101).keys()]
                .map((i) => 1950 + i)
                .map((year) => (
                  <Picker.Item key={year} label={`${year}`} value={`${year}`} />
                ))}
            </Picker>
          </View>

          {/* Gender */}
          <View className='mt-2 bg-white h-12 w-40 rounded-full pl-10 flex justify-center'>
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue, itemIndex) => setGender(itemValue)}
            >
              <Picker.Item label='Gender' value='' color='#898A8D' />
              <Picker.Item label='Male' value='male' />
              <Picker.Item label='Female' value='female' />
              <Picker.Item label='Others' value='others' />
            </Picker>
          </View>

          {/* Location */}
          <View>
            <TouchableOpacity className='bg-[#F6F6F6] border border-[#E8E8E8] flex rounded-full h-12 w-40 px-4 mt-4 flex-row justify-center items-center'>
              <Text className='text-[#898A8D] text-base font-medium'>
                Location
              </Text>
            </TouchableOpacity>
          </View>

          {/* Top Interests */}
          <View>
            <TouchableOpacity
              disabled={true}
              className='bg-[#F6F6F6] border border-[#E8E8E8] flex rounded-full h-12 w-80 px-4 mt-4 flex-row justify-center items-center'
            >
              <Text className='text-[#898A8D] text-base font-medium'>
                3 Top Interests
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : null}

      {/* edit profile button */}
      {!editMode ? (
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
      ) : (
        <View className='mt-4'>
          <TouchableOpacity
            className='bg-[#22A6B3] rounded-full w-40 h-12 flex-row justify-center items-center'
            onPress={() => setEditMode(false)}
          >
            <Text className='text-white text-base font-semibold'>Save</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

export default OwnProfileScreen
