import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modal'
import React, { useState } from 'react'

const AgeRangePickerModal = ({
  isAgeRangeModalVisible,
  setIsAgeRangeModalVisible,
  setAgeRange,
}) => {
  // Constants
  const ageRanges = ['18-25', '26-33', '34-41', '42-49', '50+']
  return (
    <Modal
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      isVisible={isAgeRangeModalVisible}
      onBackdropPress={() => setIsAgeRangeModalVisible(false)}
      onRequestClose={() => {
        setIsAgeRangeModalVisible(false)
      }}
      avoidKeyboard={true}
    >
      <View className='flex-1 justify-center items-center'>
        <View className=' absolute w-[100vw] h-[25vh] rounded-2xl justify-start items-center py-5'>
          {ageRanges.map((ageRange, idx) => (
            <TouchableOpacity
              key={idx}
              className={
                'bg-[#F6F6F6] w-80 h-12 flex-row justify-center items-center border b-2' +
                (idx === 0
                  ? ' rounded-t-2xl'
                  : idx === ageRanges.length - 1
                  ? ' rounded-b-2xl'
                  : '')
              }
              onPress={() => {
                setAgeRange(ageRange)
                setIsAgeRangeModalVisible(false)
              }}
            >
              <Text className='text-base font-semibold'>{ageRange}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  )
}

export default AgeRangePickerModal
