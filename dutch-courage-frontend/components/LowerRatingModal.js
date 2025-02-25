import { View, Text, TouchableOpacity, Alert } from 'react-native'
import Modal from 'react-native-modal'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CheckBox } from '@rneui/themed'
import { TextInput } from 'react-native'
import { rateUser, resetRateUser } from '../features/user/userSlice'
import Toast from 'react-native-toast-message'
import ToastConfig from '../utils/toastConfig'

const LowerRatingModal = ({ modalVisible, setModalVisible, rating, userId }) => {
  const dispatch = useDispatch()
  // const { userId } = route.params;

  const { userInfo } = useSelector((state) => state.auth)
  const {
    isRateUserLoading,
    isRateUserSuccess,
    isRateUserError,
    rateUserErrorMessage,
  } = useSelector((state) => state.user)

  const [lowerStarReason, setLowerStarReason] = useState('')
  const [otherReason, setOtherReason] = useState('')

  // Function to handle rate user
  const handleRateUser = () => {
    if (lowerStarReason === 'Other' && otherReason === '') {
      Toast.show({
        type: 'error',
        text1: 'Please provide a reason for lower rating',
        visibilityTime: 3000,
        autoHide: true,
      })
    } else if (lowerStarReason === '') {
      Toast.show({
        type: 'error',
        text1: 'Please provide a reason for lower rating',
        visibilityTime: 3000,
        autoHide: true,
      })
    } else {
      dispatch(
        rateUser({
          userId,
          rating,
          reason: lowerStarReason,
          otherReason: otherReason,
        })
      )
    }
  }

  // show toast message if star rating is successful or show error message if star rating fails
  useEffect(() => {
    if (isRateUserSuccess) {
      Toast.show({
        type: 'success',
        text1: 'Your rating was submitted successfully',
        visibilityTime: 3000,
        autoHide: true,
      })
      dispatch(resetRateUser())
    } else if (isRateUserError) {
      Toast.show({
        type: 'error',
        text1: rateUserErrorMessage,
        visibilityTime: 3000,
        autoHide: true,
      })
      dispatch(resetRateUser())
    }
  }, [isRateUserSuccess, isRateUserError])

  return (
    <Modal
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      isVisible={modalVisible}
      onBackdropPress={() => setModalVisible(false)}
      onRequestClose={() => {
        setModalVisible(false)
      }}
      // avoidKeyboard={true}
    >
      <View className='flex-1 justify-center items-center'>
        <View className='absolute w-[80vw] h-[40vh] rounded-2xl flex-row justify-center bg-[#3fe7f6]'>
          <View className='absolute w-[70vw] h-[6vh] flex-row justify-center items-center mt-5 rounded-2xl bg-white'>
            <Text className='text-[#808080]'>
              Please provide a reason for lower star rating
            </Text>
          </View>
        </View>

        <View className='w-[60vw] h-[10vh] flex-row top-5'>
          <View className='left-[-20]'>
            <CheckBox
              checked={lowerStarReason === 'Underage' ? true : false}
              checkedIcon='circle'
              checkedColor='#808080'
              uncheckedIcon='circle'
              uncheckedColor='white'
              onPress={() => setLowerStarReason('Underage')}
              title='Underage'
              textStyle={{ color: '#808080' }}
              containerStyle={{
                backgroundColor: 'transparent',
              }}
            ></CheckBox>

            <CheckBox
              checked={lowerStarReason === 'Spam' ? true : false}
              checkedIcon='circle'
              checkedColor='#808080'
              uncheckedIcon='circle'
              uncheckedColor='white'
              onPress={() => setLowerStarReason('Spam')}
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
              checked={lowerStarReason === 'Soliciting' ? true : false}
              checkedIcon='circle'
              checkedColor='#808080'
              uncheckedIcon='circle'
              uncheckedColor='white'
              onPress={() => setLowerStarReason('Soliciting')}
              title='Soliciting'
              textStyle={{ color: '#808080' }}
              containerStyle={{
                backgroundColor: 'transparent',
              }}
            ></CheckBox>

            <CheckBox
              checked={lowerStarReason === 'Other' ? true : false}
              checkedIcon='circle'
              checkedColor='#808080'
              uncheckedIcon='circle'
              uncheckedColor='white'
              onPress={() => setLowerStarReason('Other')}
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
                  lowerStarReason === 'Other'
                    ? 'Please specify a reason for lower rating'
                    : ''
                }
                keyboardType='default'
                className='text-[#808080] justify-start items-center border-b-2 border-[#999999] w-[50vw] h-[5vh]'
                value={otherReason}
                onChangeText={(text) => {
                  if (text.length <= 40) {
                    setOtherReason(text)
                    // setOtherReasonCount(text.length);
                  }
                }}
                onEndEditing={() => {
                  setModalVisible(false)
                }}
              ></TextInput>
            </View>
            <TouchableOpacity onPress={() => handleRateUser()}>
              <View className='w-32 h-8 rounded-xl bg-[#22A6B3] flex-row justify-center items-center top-3'>
                <Text className='text-white font-bold'>Submit</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Toast config={ToastConfig} />
    </Modal>
  )
}

export default LowerRatingModal
