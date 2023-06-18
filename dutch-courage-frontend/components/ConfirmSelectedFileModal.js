import React from 'react'
import Modal from 'react-native-modal'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import * as ImagePicker from 'expo-image-picker'

const ConfirmSelectedFileModal = ({
    selectedImage,
    setSelectedImage,

    isConfirmSelectedFileModalVisible,
    setIsConfirmSelectedFileModalVisible,
}) => {

  return (
    <Modal
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        isVisible={isConfirmSelectedFileModalVisible}
        onBackdropPress={() => setIsConfirmSelectedFileModalVisible(false)}
        onRequestClose={() => {
            setIsConfirmSelectedFileModalVisible(false)
        }}
        avoidKeyboard={true}
    >
        <View className='flex-1 justify-center items-center'>
            <Image
                source={{ uri: selectedImage }}
                style={{ width: 300, height: 300 }}
            />
        </View>
    </Modal>
  )
}

export default ConfirmSelectedFileModal