import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modal'
import React, { useState } from 'react'

const MantraModal = ({
  isMantraModalVisible,
  setIsMantraModalVisible,
  mantra,
  mantraCount,
  setMantra,
  setMantraCount,
}) => {
  return (
    <Modal
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      backdropOpacity={0.9}
      isVisible={isMantraModalVisible}
      onBackdropPress={() => setIsMantraModalVisible(false)}
      onRequestClose={() => {
        setIsMantraModalVisible(false)
      }}
      avoidKeyboard={true}
    >
      <View className='flex-1 justify-center items-center'>
        <View className=' absolute top-4 w-[100vw] h-[25vh] rounded-2xl justify-start items-center py-5'>
          <View className='flex-row mt-3 justify-center items-center mb-[-5] z-10'>
            <Text className='text-[#898A8D] text-xs mr-48'>Your Mantra</Text>
            <Text className='text-[#898A8D] text-xs'>{mantra.length}/40</Text>
          </View>
          <View>
            <TextInput
              placeholder='Mantra'
              keyboardType='default'
              className=' w-80 h-10 flex-row justify-start items-center border-b-2 border-[#22A6B3] text-white text-sm px-1'
              value={mantra}
              onChangeText={(text) => {
                if (text.length <= 40) {
                  setMantra(text)
                  setMantraCount(text.length)
                }
              }}
              onEndEditing={() => {
                setIsMantraModalVisible(false)
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default MantraModal
