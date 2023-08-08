import { View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { rateUser, resetRateUser } from '../features/user/userSlice'

const TouchableRatingStars = ({
  rating,
  rateUser,
  setOtherUserRatingValue,
}) => {
  return (
    <View className='flex-row justify-center items-center'>
      <View className='flex-row justify-center items-center'>
        <TouchableOpacity
          onPress={() => {
            rateUser(1)
            setOtherUserRatingValue(1)
          }}
        >
          <Image
            source={
              rating >= 1
                ? require('../assets/projectImages/starFull.png')
                : rating >= 0.5
                ? require('../assets/projectImages/starHalf.png')
                : require('../assets/projectImages/starEmpty.png')
            }
            className='w-8 h-8 mx-1'
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            rateUser(2)
            setOtherUserRatingValue(2)
          }}
        >
          <Image
            source={
              rating >= 2
                ? require('../assets/projectImages/starFull.png')
                : rating >= 1.5
                ? require('../assets/projectImages/starHalf.png')
                : require('../assets/projectImages/starEmpty.png')
            }
            className='w-8 h-8 mx-1'
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => rateUser(3)}>
          <Image
            source={
              rating >= 3
                ? require('../assets/projectImages/starFull.png')
                : rating >= 2.5
                ? require('../assets/projectImages/starHalf.png')
                : require('../assets/projectImages/starEmpty.png')
            }
            className='w-8 h-8 mx-1'
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => rateUser(4)}>
          <Image
            source={
              rating >= 4
                ? require('../assets/projectImages/starFull.png')
                : rating >= 3.5
                ? require('../assets/projectImages/starHalf.png')
                : require('../assets/projectImages/starEmpty.png')
            }
            className='w-8 h-8 mx-1'
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => rateUser(5)}>
          <Image
            source={
              rating >= 5
                ? require('../assets/projectImages/starFull.png')
                : rating >= 4.5
                ? require('../assets/projectImages/starHalf.png')
                : require('../assets/projectImages/starEmpty.png')
            }
            className='w-8 h-8 mx-1'
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default TouchableRatingStars
