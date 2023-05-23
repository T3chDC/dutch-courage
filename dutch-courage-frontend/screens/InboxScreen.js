import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Alert,
    BackHandler,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import Toast from 'react-native-toast-message'
import SwipeButton from 'rn-swipe-button'

const InboxScreen = () => {

    return (
        <View className='bg-black flex-1 justify-start items-center relative'>
            <TouchableOpacity
                className='absolute top-10 left-4 flex-row items-center'
                onPress={() => backAction()}
            >
                {/* <ChevronLeftIcon size={20} color='white' /> */}
                <Text className='text-white text-base top-[-1]'>{'< Back'}</Text>
            </TouchableOpacity>

            <View className='mt-2 flex-row justify-center items-center'>
                <Text className='text-[#808080] text-base  absolute top-20 left-10'>
                    Messages
                </Text>
                <View className='mt-[110] flex-1 h-0.5 w-60 bg-[#22A6B3]'>   
                </View>
            </View>




        </View>
    )
}

export default InboxScreen