import { View, Text, Image, TouchableOpacity, Alert } from 'react-native'
import Modal from 'react-native-modal'
import React, { useState } from 'react'
import Swiper from 'react-native-swiper'

const GalleryImageViewerModal = ({
  isGalleryImageModalVisible,
  setIsGalleryImageModalVisible,
  images,
  changeGalleryImages,
  setSelectedProfileImage,
}) => {
  const filteredImages = images.filter((image) => image !== '')

  return (
    <Modal
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      backdropOpacity={0.9}
      isVisible={isGalleryImageModalVisible}
      onBackdropPress={() => setIsGalleryImageModalVisible(false)}
      onRequestClose={() => {
        setIsGalleryImageModalVisible(false)
      }}
      avoidKeyboard={true}
    >
      <View className='flex-1 justify-center items-center'>
        {/* Image swiper */}
        <Swiper
          style={{ height: 800 }}
          showsButtons={true}
          showsPagination={false}
          loop={false}
        >
          {filteredImages.map((image, idx) => (
            <View key={idx} className='flex-1 justify-center items-center'>
              <Image
                source={{ uri: image }}
                style={{ width: 300, height: 300 }}
              />

              {/* Image Choose as profile picture Button */}
              <TouchableOpacity
                onPress={() => {
                  setSelectedProfileImage(image)
                  setIsGalleryImageModalVisible(false)
                }}
                className='bg-[#22A6B3] rounded-full w-60 h-12 flex-row justify-center items-center mt-10'
              >
                <Text className='text-white'>Choose as Profile Picture</Text>
              </TouchableOpacity>

              {/* Delete Image Button */}
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    'Are you sure you want to delete this image?',
                    'This action cannot be undone',
                    [
                      {
                        text: 'Cancel',
                        onPress: () => null,
                        style: 'cancel',
                      },
                      {
                        text: 'Delete',
                        onPress: () => {
                          const newImages = images.filter(
                            (img) => img !== image
                          )
                          changeGalleryImages(newImages)
                        },
                      },
                    ],
                    { cancelable: false }
                  )
                }}
                className='bg-[#22A6B3] rounded-full w-40 h-12 flex-row justify-center items-center mt-10'
              >
                <Text className='text-white'>Delete Image</Text>
              </TouchableOpacity>

              {/* Cancel Button */}
              {/* <TouchableOpacity
                onPress={() => {
                  setIsGalleryImageModalVisible(false)
                }}
                className='bg-[#22A6B3] rounded-full w-40 h-12 flex-row justify-center items-center mt-10'
              >
                <Text className='text-white'>Cancel</Text>  
              </TouchableOpacity> */}
            </View>
          ))}
        </Swiper>
      </View>
    </Modal>
  )
}

export default GalleryImageViewerModal
