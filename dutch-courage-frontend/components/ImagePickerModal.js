import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal'
import * as ImagePicker from 'expo-image-picker'

const ImagePickerModal = ({
  isImageChooseModalVisible,
  setIsImageChooseModalVisible,
  setSelectedImage,
  setGalleryImageCount = () => null,
}) => {
  // Function to pick image from gallery
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!')
        return
      }
    } catch (err) {
      console.log(err)
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    })
    // console.log(result)
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri)
      setIsImageChooseModalVisible(false)
      setGalleryImageCount((prev) => prev + 1)
    }
  }

  // Function to take image from camera
  const takeImage = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync()
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!')
        return
      }
    } catch (err) {
      console.log(err)
    }
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    })

    // console.log(result)

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri)
      setIsImageChooseModalVisible(false)
      setGalleryImageCount((prev) => prev + 1)
    }
  }

  return (
    <Modal
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      isVisible={isImageChooseModalVisible}
      onBackdropPress={() => setIsImageChooseModalVisible(false)}
      onRequestClose={() => {
        setIsImageChooseModalVisible(false)
      }}
    >
      <View className='flex-1 justify-center items-center'>
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
            <Text className='text-white text-base font-semibold'>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

// Default props
// ImagePickerModal.defaultProps = {
//   setGalleryImageCount: () => null,
// }

export default ImagePickerModal
