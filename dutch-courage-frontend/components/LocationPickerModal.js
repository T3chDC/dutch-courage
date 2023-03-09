import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modal'
import React, { useState } from 'react'
import locations from '../assets/staticData/locations'

const LocationPickerModal = ({
  isLocationModalVisible,
  setIsLocationModalVisible,
  setLocation,
}) => {
  const [locationSearchQuery, setLocationSearchQuery] = useState('')
  const [filteredLocations, setFilteredLocations] = useState([])

  // Function to handle location search
  const handleLocationSearch = (query) => {
    const filtered = locations.filter((selectedLocation) => {
      if (query === '') {
        return null
      } else if (selectedLocation.toLowerCase().includes(query.toLowerCase())) {
        return selectedLocation
      }
    })
    setFilteredLocations(filtered)
    setLocationSearchQuery(query)
  }

  return (
    <Modal
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      isVisible={isLocationModalVisible}
      onBackdropPress={() => setIsLocationModalVisible(false)}
      onRequestClose={() => {
        setIsLocationModalVisible(false)
      }}
      avoidKeyboard={true}
    >
      <View className='flex-1 justify-center items-center'>
        <View className=' absolute top-4 w-[100vw] h-[25vh] rounded-2xl justify-start items-center py-5'>
          <Text className='text-white text-base font-semibold'>
            Choose your location
          </Text>
          <TextInput
            placeholder='Search location...'
            className='bg-[#F6F6F6] border border-[#E8E8E8] rounded-md h-12 w-80 px-4 mt-4'
            value={locationSearchQuery}
            onChangeText={handleLocationSearch}
          />
          {filteredLocations.map(
            (location, idx) =>
              idx < 5 && (
                <TouchableOpacity
                  key={location}
                  className='bg-[#F6F6F6] w-80 h-12 flex-row justify-center items-center'
                  onPress={() => {
                    setLocation(location)
                    setIsLocationModalVisible(false)
                  }}
                >
                  <Text className='text-base font-semibold'>{location}</Text>
                </TouchableOpacity>
              )
          )}
        </View>
      </View>
    </Modal>
  )
}

export default LocationPickerModal
