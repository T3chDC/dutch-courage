import { View, Text, Image, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modal'
import React, { useState } from 'react'
import { BACKEND_URL } from '../config'
import ImagePickerModal from './ImagePickerModal'

const ProfileImageViewerModal = ({
  isProfileImageModalVisible,
  setIsProfileImageModalVisible,
  selectedProfileImage,
  setSelectedProfileImage,
  imageUrl,
}) => {
  // Modal state variables
  const [isImagePickerModalVisible, setIsImagePickerModalVisible] =
    useState(false)

  return (
    <Modal
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      backdropOpacity={0.9}
      isVisible={isProfileImageModalVisible}
      onBackdropPress={() => setIsProfileImageModalVisible(false)}
      onRequestClose={() => {
        setIsProfileImageModalVisible(false)
      }}
      avoidKeyboard={true}
    >
      <View className='flex-1 justify-center items-center'>
        {/* Image viw area */}
        <Image
          source={{ uri: selectedProfileImage || `${BACKEND_URL}/uploads/${imageUrl.slice(
            imageUrl.lastIndexOf('/') + 1
          )}`}}
          style={{ width: 300, height: 300 }}
        />
        {/* Image Chooser Button */}
        <TouchableOpacity
          onPress={() => {
            setIsImagePickerModalVisible(true)
          }}
          className='bg-[#22A6B3] rounded-full w-40 h-12 flex-row justify-center items-center mt-10'
        >
          <Text className='text-white'>Change Profile Picture</Text>
        </TouchableOpacity>

        {/* Cancel Button */}
        {/* <TouchableOpacity
          onPress={() => {
            setIsProfileImageModalVisible(false)
          }}
          className='bg-[#22A6B3] rounded-full w-40 h-12 flex-row justify-center items-center mt-10'
        >
          <Text className='text-white'>Cancel</Text>
        </TouchableOpacity> */}

        {/* Image Picker Modal */}
        <ImagePickerModal
          isImageChooseModalVisible={isImagePickerModalVisible}
          setIsImageChooseModalVisible={setIsImagePickerModalVisible}
          setSelectedImage={setSelectedProfileImage}
        />
      </View>
    </Modal>
  )
}

export default ProfileImageViewerModal
