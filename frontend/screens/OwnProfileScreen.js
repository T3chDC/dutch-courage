import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Picker,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { PlusIcon } from 'react-native-heroicons/solid'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRoute, useNavigation } from '@react-navigation/native'

const OwnProfileScreen = () => {
  const navigation = useNavigation()

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

  // Function to pick image from gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    console.log(result)

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri)
    }
  }

  // Function to take image from camera
  const takeImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    console.log(result)

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri)
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
        className='w-[100vw]'
      />
      {/* Profile information container */}
      <View className='absolute w-[100vw] h-[100vh] opacity-50 flex-1 justify-start items-center'></View>
      {/* profile image and image picker */}
      <View className='mt-[-230] w-64 h-64 rounded-full bg-[#FCFCFE] flex-row justify-center items-center'>
        <TouchableOpacity onPress={() => openModal()}>
          {imageUrl ? (
            <Image
              source={require('../assets/projectImages/avatarPlaceholder.png')}
              className='w-64 h-64 rounded-full'
            />
          ) : (
            <PlusIcon size={40} color={'black'} />
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
          <View className='flex-1 justify-center items-center'>
            <View className='bg-white w-[300px] h-[200px] rounded-2xl flex-col justify-center items-center'>
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
                onPress={() => navigation.goBack()}
              >
                <Text className='text-white text-base font-semibold'>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

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
