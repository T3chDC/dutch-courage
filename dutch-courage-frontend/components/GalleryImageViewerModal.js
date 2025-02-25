import { View, Text, Image, TouchableOpacity, Alert } from 'react-native'
import Modal from 'react-native-modal'
import React, { useState } from 'react'
import { BACKEND_URL } from '../config'
import Swiper from 'react-native-swiper'

const GalleryImageViewerModal = ({
  isGalleryImageModalVisible,
  setIsGalleryImageModalVisible,
  galleryImage1Url,
  setGalleryImage1Url,
  galleryImage2Url,
  setGalleryImage2Url,
  galleryImage3Url,
  setGalleryImage3Url,
  selectedGalleryImage1,
  setSelectedGalleryImage1,
  selectedGalleryImage2,
  setSelectedGalleryImage2,
  selectedGalleryImage3,
  setSelectedGalleryImage3,
  profileImageUrl,
  selectedProfileImage,
  setSelectedProfileImage,
  setSelectedImagesForDelete,
  setGalleryImageCount,
  switchProfileImageWithGalleryImage,
}) => {
  // console.log('galleryImage1Url:', galleryImage1Url)
  // console.log('selectedGalleryImage1:', selectedGalleryImage1)
  // console.log('profileImageUrl:', profileImageUrl)
  // console.log('selectedProfileImage:', selectedProfileImage)

  return (
    <Modal
      // animationIn={'slideInUp'}
      // animationOut={'slideOutDown'}
      animationIn={"zoomIn"}
      animationInTiming={600}
      animationOut={"zoomOut"}
      animationOutTiming={600}
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
          // loop={false}
          buttonWrapperStyle={{position: 'absolute', top: -90}}
        >
          {(galleryImage1Url || selectedGalleryImage1) && (
            <View className='flex-1 justify-center items-center'>
              <Image
                source={{
                  uri:
                    selectedGalleryImage1 ||
                    `${BACKEND_URL}/uploads/${galleryImage1Url.slice(
                      galleryImage1Url.lastIndexOf('/') + 1
                    )}`,
                }}
                style={{ width: 300, height: 300 }}
              />

              {/* Image Choose as profile picture Button */}
              <TouchableOpacity
                onPress={() => {
                  // Exchange the profile image with the selected image
                  switchProfileImageWithGalleryImage('galleryImage1')
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
                          setGalleryImage1Url('')
                          setSelectedGalleryImage1('')
                          setSelectedImagesForDelete((prevState) => [
                            ...prevState,
                            galleryImage1Url,
                          ])
                          setGalleryImageCount((prevState) => prevState - 1)
                          setIsGalleryImageModalVisible(false)
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
            </View>
          )}

          {(galleryImage2Url || selectedGalleryImage2) && (
            <View className='flex-1 justify-center items-center'>
              <Image
                source={{
                  uri:
                    selectedGalleryImage2 ||
                    `${BACKEND_URL}/uploads/${galleryImage2Url.slice(
                      galleryImage2Url.lastIndexOf('/') + 1
                    )}`,
                }}
                style={{ width: 300, height: 300 }}
              />

              {/* Image Choose as profile picture Button */}

              <TouchableOpacity
                onPress={() => {
                  switchProfileImageWithGalleryImage('galleryImage2')
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
                          setGalleryImage2Url('')
                          setSelectedGalleryImage2('')
                          setSelectedImagesForDelete((prevState) => [
                            ...prevState,
                            galleryImage2Url,
                          ])
                          setGalleryImageCount((prevState) => prevState - 1)
                          setIsGalleryImageModalVisible(false)
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
            </View>
          )}

          {(galleryImage3Url || selectedGalleryImage3) && (
            <View className='flex-1 justify-center items-center'>
              <Image
                source={{
                  uri:
                    selectedGalleryImage3 ||
                    `${BACKEND_URL}/uploads/${galleryImage3Url.slice(
                      galleryImage3Url.lastIndexOf('/') + 1
                    )}`,
                }}
                style={{ width: 300, height: 300 }}
              />

              {/* Image Choose as profile picture Button */}
              <TouchableOpacity
                onPress={() => {
                  switchProfileImageWithGalleryImage('galleryImage3')
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
                          setGalleryImage3Url('')
                          setSelectedGalleryImage3('')
                          setSelectedImagesForDelete((prevState) => [
                            ...prevState,
                            galleryImage3Url,
                          ])
                          setGalleryImageCount((prevState) => prevState - 1)
                          setIsGalleryImageModalVisible(false)
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
            </View>
          )}
        </Swiper>
      </View>
    </Modal>
  )
}

export default GalleryImageViewerModal
