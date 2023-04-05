import { View, Text, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modal'
import React, { useState } from 'react'

const GenderPickerModal = ({
  isGenderModalVisible,
  setIsGenderModalVisible,
  setGender,
}) => {
  const genders = [
    'Man',
    'Woman',
    'Agender',
    'Bigender',
    'Gender Fluid',
    'Gender Nonconforming',
    'Gender Queer',
    'Intersex',
    'Non Binary',
    'Pangender',
    'Trans',
    'Other',
  ]

  const [selectedGender, setSelectedGender] = useState('')
  return (
    <Modal
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      isVisible={isGenderModalVisible}
      onBackdropPress={() => setIsGenderModalVisible(false)}
      onRequestClose={() => {
        setIsGenderModalVisible(false)
      }}
      avoidKeyboard={true}
      backdropOpacity={1}
    >
      <View className='flex-1 justify-center items-center'>
        <View className=' absolute top-1 w-[100vw] h-[25vh] rounded-2xl justify-start items-center pt-2 pb-4'>
          <View className='flex-row justify-between items-center w-80'>
            <TouchableOpacity onPress={() => setIsGenderModalVisible(false)}>
              <Text className='text-white text-base font-semibold'>
                {'< Back'}
              </Text>
            </TouchableOpacity>
            <Text className='text-white text-base font-semibold'>Gender</Text>
          </View>
        </View>
        <View className='flex-1 justify-center items-center w-80'>
          <>
            {genders.map((gender, idx) => {
              return (
                <TouchableOpacity
                  key={idx}
                  className='bg-black w-80 h-12 flex-row justify-start items-center border-b-2 border-[#22A6B3]'
                  onPress={() => {
                    setGender(gender)
                    setIsGenderModalVisible(false)
                  }}
                >
                  <Text className='text-[#22A6B3] text-base font-semibold'>{gender}</Text>
                </TouchableOpacity>
              )
            })}
          </>
        </View>
      </View>
    </Modal>
  )
}

export default GenderPickerModal
