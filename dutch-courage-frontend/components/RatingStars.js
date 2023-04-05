import { View, Image } from 'react-native'
import React from 'react'

const RatingStars = ({ rating }) => {
  return (
    <View className='flex-row justify-center items-center'>
      <View className='flex-row justify-center items-center'>
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
      </View>
    </View>
  )
}

export default RatingStars
