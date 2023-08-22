import { View, TouchableOpacity } from 'react-native'
import { UserIcon, ChatBubbleLeftRightIcon } from 'react-native-heroicons/solid'
import React from 'react'

const BottomDrawer = () => {
  return (
    <>
      <View className='absolute bottom-3 w-[100vw] flex-row justify-between items-center'>
        <View className='w-1/2 flex-row justify-center items-center'>
          <TouchableOpacity onPress={() => navigation.navigate('UserInbox')}>
            <ChatBubbleLeftRightIcon size={40} color={'white'} />
          </TouchableOpacity>
        </View>

        <View className='w-1/2 flex-row justify-center items-center'>
          <TouchableOpacity
            onPress={() => navigation.navigate('UserProfileEdit')}
          >
            <UserIcon size={40} color={'white'} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}

export default BottomDrawer
