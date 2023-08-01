import { View, Text, TouchableOpacity, Alert } from 'react-native'
import Modal from 'react-native-modal'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CheckBox } from '@rneui/themed'
import { TextInput } from 'react-native-gesture-handler'

const BlockModal = ({
  modalVisible,
  setModalVisible,
  userToBeBlocked,
  // report,
  // setReport,
  // reportCount,
  // setReportCount,
}) => {
  const [blockReason, setBlockReason] = useState('')
  const [otherReason, setOtherReason] = useState('')

  return (
    <Modal
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      isVisible={modalVisible}
      onBackdropPress={() => setModalVisible(false)}
      onRequestClose={() => {
        setModalVisible(false)
      }}
    >
      <View className='flex-1 justify-center items-center'>
        <View className='absolute w-[80vw] h-[40vh] rounded-2xl flex-row justify-center bg-[#3fe7f6]'>
          <View className='absolute w-[70vw] h-[6vh] flex-row justify-center items-center mt-5 rounded-2xl bg-white'>
            <Text className='text-[#808080]'>
              Please provide a reason for blocking user
            </Text>
          </View>
        </View>

        <View className='w-[60vw] h-[10vh] flex-row top-5'>
          <View className='left-[-20]'>
            <CheckBox
              checked={blockReason === 'Underage' ? true : false}
              checkedIcon='circle'
              checkedColor='#808080'
              uncheckedIcon='circle'
              uncheckedColor='white'
              onPress={() => setBlockReason('Underage')}
              title='Underage'
              textStyle={{ color: '#808080' }}
              containerStyle={{
                backgroundColor: 'transparent',
              }}
            ></CheckBox>

            <CheckBox
              checked={blockReason === 'Spam' ? true : false}
              checkedIcon='circle'
              checkedColor='#808080'
              uncheckedIcon='circle'
              uncheckedColor='white'
              onPress={() => setBlockReason('Spam')}
              title='Spam'
              textStyle={{ color: '#808080' }}
              containerStyle={{
                backgroundColor: 'transparent',
                marginTop: -10,
              }}
            ></CheckBox>
          </View>

          <View className='left-[-30]'>
            <CheckBox
              checked={blockReason === 'Soliciting' ? true : false}
              checkedIcon='circle'
              checkedColor='#808080'
              uncheckedIcon='circle'
              uncheckedColor='white'
              onPress={() => setBlockReason('Soliciting')}
              title='Soliciting'
              textStyle={{ color: '#808080' }}
              containerStyle={{
                backgroundColor: 'transparent',
              }}
            ></CheckBox>

            <CheckBox
              checked={blockReason === 'Other' ? true : false}
              checkedIcon='circle'
              checkedColor='#808080'
              uncheckedIcon='circle'
              uncheckedColor='white'
              onPress={() => setBlockReason('Other')}
              title='Other'
              textStyle={{ color: '#808080' }}
              containerStyle={{
                backgroundColor: 'transparent',
                marginTop: -10,
              }}
            ></CheckBox>
          </View>
        </View>

        <View className='rounded-2xl justify-end bottom-[-28]'>
          <View className='w-[70vw] h-[15vh] justify-center items-center mt-5 rounded-2xl bg-white'>
            <View>
              <TextInput
                placeholder={
                  blockReason === 'Other'
                    ? 'Please specify other reason'
                    : ''
                }
                keyboardType='default'
                editable={blockReason === 'Other' ? true : false}
                className='text-[#808080] justify-start items-center border-b-2 border-[#999999] w-[50vw] h-[5vh]'
                onChangeText={(text) => setOtherReason(text)}
              ></TextInput>
            </View>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <View className='w-32 h-8 rounded-xl bg-[#22A6B3] flex-row justify-center items-center top-3'>
                <Text className='text-white font-bold'>Submit</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default BlockModal
