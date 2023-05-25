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

            {/* Messages Section /> */}
            <View className='flex-row justify-center items-center'>
                <Text className='text-[#808080] text-base  absolute top-20 left-10'>
                    Messages
                </Text>
                <View className='mt-[110] flex-1 h-[0.8] w-60 bg-[#22A6B3]'>
                </View>
            </View>

            {/* Messages On Inbox /> */}
            <View className='mt-[15]  mx-[5] flex-row'>
                <View className='w-[60] flex-row'>
                    <View className='w-[42] h-[40] rounded-full bg-[#FCFCFE] justify-center items-center'>
                        <Image
                            source='https://w0.peakpx.com/wallpaper/979/89/HD-wallpaper-purple-smile-design-eye-smily-profile-pic-face-thumbnail.jpg'
                            className='w-10 h-10 rounded-full'
                            resizeMode='cover'
                        />
                    </View>
                </View>

                <View>
                    <View className='w-[180] flex-row'>
                        <View className='w-[240] flex-row'>
                            <Text className='text-white font-bold'>Khonshu</Text>
                        </View>
                        <View className='w-[80] flex-row'>
                            <Text className='text-white text-xs text-[#22A6B3]'>16:31</Text>
                        </View>
                    </View>
                    <View className='w-[180] flex-row mt-1'>
                        <Text className='text-white text-xs'>Your souls belongs to me</Text>
                    </View>
                    <View className='mt-3 h-[1] w-[300] bg-[#22A6B3]'>
                    </View>
                </View>

            </View>

            <View className='mt-[15]  mx-[5] flex-row'>
                <View className='w-[60] flex-row'>
                    <View className='w-[42] h-[40] rounded-full bg-[#FCFCFE] justify-center items-center'>
                        <Image
                            source='https://w0.peakpx.com/wallpaper/979/89/HD-wallpaper-purple-smile-design-eye-smily-profile-pic-face-thumbnail.jpg'
                            className='w-10 h-10 rounded-full'
                            resizeMode='cover'
                        />
                    </View>
                </View>

                <View>
                    <View className='w-[180] flex-row'>
                        <View className='w-[240] flex-row'>
                            <Text className='text-white font-bold'>Thor</Text>
                        </View>
                        <View className='w-[80] flex-row'>
                            <Text className='text-white text-xs text-end text-[#808080]'>Yesterday</Text>
                        </View>
                    </View>
                    <View className='w-[180] flex-row mt-1'>
                        <Text className='text-white text-xs'>You stole my hammer, where is it?</Text>
                    </View>
                    <View className='mt-3 h-[1] w-[300] bg-[#22A6B3]'>
                    </View>
                </View>

            </View>

            <View className='mt-[15]  mx-[5] flex-row'>
                <View className='w-[60] flex-row'>
                    <View className='w-[42] h-[40] rounded-full bg-[#FCFCFE] justify-center items-center'>
                        <Image
                            source='https://w0.peakpx.com/wallpaper/979/89/HD-wallpaper-purple-smile-design-eye-smily-profile-pic-face-thumbnail.jpg'
                            className='w-10 h-10 rounded-full'
                            resizeMode='cover'
                        />
                    </View>
                </View>

                <View>
                    <View className='w-[180] flex-row'>
                        <View className='w-[240] flex-row'>
                            <Text className='text-white font-bold'>Captain America</Text>
                        </View>
                        <View className='w-[80] flex-row'>
                            <Text className='text-white text-xs text-end text-[#808080]'>Saturday</Text>
                        </View>
                    </View>
                    <View className='w-[180] flex-row mt-1'>
                        <Text className='text-white text-xs'>I don't know what you're talking about</Text>
                    </View>
                    <View className='mt-3 h-[1] w-[300] bg-[#22A6B3]'>
                    </View>
                </View>

            </View>

            <View className='mt-[15]  mx-[5] flex-row'>
                <View className='w-[60] flex-row'>
                    <View className='w-[42] h-[40] rounded-full bg-[#FCFCFE] justify-center items-center'>
                        <Image
                            source='https://w0.peakpx.com/wallpaper/979/89/HD-wallpaper-purple-smile-design-eye-smily-profile-pic-face-thumbnail.jpg'
                            className='w-10 h-10 rounded-full'
                            resizeMode='cover'
                        />
                    </View>
                </View>

                <View>
                    <View className='w-[180] flex-row'>
                        <View className='w-[240] flex-row'>
                            <Text className='text-white font-bold'>Iron Man</Text>
                        </View>
                        <View className='w-[80] flex-row'>
                            <Text className='text-white text-xs text-end text-[#808080]'>21/04/2023</Text>
                        </View>
                    </View>
                    <View className='w-[180] flex-row mt-1'>
                        <Text className='text-white text-xs'>I am iron man, Live in Uganda</Text>
                    </View>
                    <View className='mt-3 h-[1] w-[300] bg-[#22A6B3]'>
                    </View>
                </View>

            </View>
            
        </View>
    )
}

export default InboxScreen