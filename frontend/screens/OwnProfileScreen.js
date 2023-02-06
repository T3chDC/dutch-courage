import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Picker,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRoute, useNavigation } from '@react-navigation/native'

const OwnProfileScreen = () => {
  const navigation = useNavigation()

  const [mantra, setMantra] = useState('')
  const [birthYear, setBirthYear] = useState('')
  const [gender, setGender] = useState('')
  const [location, setLocation] = useState('')
  const [topInterests, setTopInterests] = useState([])
  const [imageUrl, setImageUrl] = useState('')
  const [editMode, setEditMode] = useState(false)

  return (
    <View className='bg-black flex-1 justify-start items-center relative'>
      {/* background cutoff image*/}
      <Image
        source={require('../assets/projectImages/profileBackgroundCutOff.png')}
        className='w-[100vw]'
      />
      {/* Profile information container */}
      <View className='absolute w-[100vw] h-[100vh] opacity-50 flex-1 justify-start items-center'></View>
      {/* profile image and image picker */}
      <View className='mt-[-230] w-64 h-64 rounded-full bg-[#FCFCFE] flex-row justify-center items-center'>
        {/* <Image
        source={require('../assets/projectImages/avatarPlaceholder.png')}
        className='mt-[-230] w-64 h-64 rounded-full'
      /> */}
      </View>

      {/* edit profile button */}
      {!editMode ? (
        <View className='mt-4'>
          <TouchableOpacity
            className='bg-[#22A6B3] rounded-full h-12 w-40 flex-row justify-center items-center'
            onPress={() => setEditMode(true)}
          >
            <Text className='text-white text-base font-semibold'>
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className='mt-4'>
          <TouchableOpacity
            className='bg-[#22A6B3] rounded-full w-40 h-12 flex-row justify-center items-center'
            onPress={() => setEditMode(false)}
          >
            <Text className='text-white text-base font-semibold'>Save</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

export default OwnProfileScreen
